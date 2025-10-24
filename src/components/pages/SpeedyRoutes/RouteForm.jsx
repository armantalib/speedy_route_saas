import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Tabs,
  Typography,
  DatePicker,
  TimePicker,
  Switch,
  Card,
  Tooltip,
  AutoComplete,
  message,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  CloseOutlined,
  ExportOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import axios from "axios";
// import { hideRouteForm } from "../redux/RouteSlice";
import AssignDriver from "../AssignDriver/AssignDriver";
import "./RouteForm.css";
import moment from "moment";
import { dataGet_, dataPost, dataPut } from "../../utils/myAxios";
import { useNavigate } from 'react-router-dom';
import { new_route_icon } from "../../icons/icon";
import { useSelector } from "react-redux";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const RouteForm = () => {
  const [showMap, setShowMap] = useState(false);

  // Autocomplete + notes states (from DrawerComponent)
  const [queries, setQueries] = useState({ start: "", stop: "", destination: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsName, setSearchResultsName] = useState([]);
  const [start, setStart] = useState(null);
  const [destination, setDestination] = useState(null);
  const [stops, setStops] = useState([]);
  const [notes, setNotes] = useState({ start: "", destination: "", stops: [] });
  const [routeIdGen, setRouteIdGen] = useState("");
  const [routeName, setRouteName] = useState("");
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [routeGeom, setRouteGeom] = useState(null); // GeoJSON data for the route
  const [isRouteCreate, setIsRouteCreate] = useState(false);

  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isButtonDisable, setIsButtonDisabled] = useState(true);
  const [customerStopId, setCustomerStopId] = useState(null);
  const navigate = useNavigate();
  const { routeDetail } = useSelector((state) => state?.route);
  const [options, setOptions] = useState({
    roundTrip: false,
    reverseOrder: false,
  });

  // Search via Mapbox
  const handleSearch = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
        { params: { access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN, limit: 10 } }
      );
      setSearchResults(response.data.features);
    } catch (err) {
      console.error("Mapbox search error:", err);
    }
  };

  // const handleSearch = async (query) => {
  //   if (!query) return;

  //   try {
  //     const response = await axios.get("https://autocomplete.search.hereapi.com/v1/autocomplete", {
  //       params: {
  //         apiKey: process.env.REACT_APP_HERE_API_KEY,
  //         q: query,
  //         limit: 10,
  //       },
  //     });

  //     setSearchResults(response.data.items);
  //   } catch (err) {
  //     console.error("HERE autocomplete error:", err);
  //   }
  // };

  const handleSearchFromDb = async (val) => {
    if (!val) return;
    const endPoint = `routes/admin/stop?q=${val}`;
    const response = await dataGet_(endPoint, {});
    if (response?.data?.success) {
      setSearchResultsName(response?.data?.data);
    } else {
      setSearchResultsName([]);
    }
  }

  useEffect(() => {
    getUpdateData()

    return () => {
      localStorage.removeItem("route_data");
    };
  }, []);

  const getUpdateData = async () => {
    //  const updateData = await localStorage.getItem("route_data");
    if (routeDetail) {
      setIsUpdate(true);
      let data1 = routeDetail;

      setUpdateData(data1);
      setRouteIdGen(data1?.routeId);
      setRouteName(data1?.name);
      setScheduleDate(data1?.scheduleDate ? moment(data1.scheduleDate) : null);
      setScheduleTime(data1?.scheduleTime ? moment(data1.scheduleTime) : null);
      setOptions({
        roundTrip: data1?.isRound || false,
        reverseOrder: data1?.isReverse || false,
      });
      setRouteGeom(data1?.routeGeometry || null);
      setDuration(data1?.duration || 0);
      setDistance(data1?.distance || 0);

      if (data1?.startPoint) {

        setStart({
          coordinates: [
            data1.startPoint.longitude,
            data1.startPoint.latitude,
          ],
          place_name: data1.startPoint.address,
        });
        setNotes((prev) => ({ ...prev, start: data1.startPoint.customer || "" }));
      }

      if (data1?.endPoint) {
        setDestination({
          coordinates: [
            data1.endPoint.longitude,
            data1.endPoint.latitude,
          ],
          place_name: data1.endPoint.address,
        });
        setNotes((prev) => ({
          ...prev,
          destination: data1.endPoint.customer || "",
        }));
      }

      if (data1?.stopsData?.length > 0) {
        setStops(data1.stopsData);
        setNotes((prev) => ({
          ...prev,
          stops: data1.stopsData.map((s) => s.notes || ""),
        }));
      }
    } else {
      const randomNumber = Math.floor(Math.random() * 1111111);
      const routeNum = "R" + randomNumber;
      setRouteIdGen(routeNum);
    }
  }



  const renderOptions = () =>
    searchResults.map((result) => ({
      value: result.place_name,
      label: <span>{result.place_name}</span>,
      result,
    }));

  const renderOptionsName = () =>
    searchResultsName.map((result) => ({
      value: result.name || result.stopName,   // fallback if key is stopName
      label: (
        <div>
          <strong>{result.name || result.stopName}</strong><br />
          <small>{result.place_name || result.address}</small>
        </div>
      ),
      result: {
        ...result,
        name: result.name || result.stopName,
        place_name: result.place_name || result.address,
      },
    }));

  const handleSelect = (_, option, type) => {
    const { geometry, place_name } = option.result;
    const coordinates = geometry.coordinates;

    if (type === "start") setStart({ coordinates, place_name });
    else if (type === "stop") {
      // setStops([...stops, { coordinates, place_name, status: 'pending', startTime: '', notes: '', completeLat: '', completeLng: '', completeTime: '', profDelivery: '', signature: '' }]);
      setNotes((prev) => ({ ...prev, stops: [...prev.stops, ""] }));
    }
    else if (type === "destination") setDestination({ coordinates, place_name, status: 'pending', startTime: '', notes: '', completeLat: '', completeLng: '', completeTime: '', profDelivery: '', signature: '' });

    setQueries({ ...queries, [type]: "" });
  };

  const handleRemoveLocation = (type, index) => {
    if (type === "start") setStart(null);
    else if (type === "destination") setDestination(null);
    else if (type === "stop") {
      setStops(stops.filter((_, i) => i !== index));
      setNotes((prev) => ({
        ...prev,
        stops: prev.stops.filter((_, i) => i !== index),
      }));
    }
  };

  const handleNotesChange = (value, type, index) => {
    setNotes((prev) => {
      const updated = { ...prev };
      if (type === "start") updated.start = value;
      else if (type === "destination") updated.destination = value;
      else if (type === "stop") updated.stops[index] = value;
      return updated;
    });
  };

  // CSV export
  const exportToCSV = () => {
    const data = [
      ["Type", "Address", "Notes"],
      ["Start", `"${start?.place_name || ""}"`, `"${notes.start}"`],
      ...stops.map((stop, i) => [`Stop ${i + 1}`, `"${stop.place_name}"`, `"${notes.stops[i] || ""}"`]),
      ["Destination", `"${destination?.place_name || ""}"`, `"${notes.destination}"`],
    ];
    const csvContent = "data:text/csv;charset=utf-8," + data.map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "route_details.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Print to PDF
  const printToPDF = () => {
    const printContent = `
      <h1>Route Details</h1>
      <table border="1" cellpadding="5" cellspacing="0" style="width:100%;">
        <thead><tr><th>Type</th><th>Address</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>Start</td><td>${start?.place_name || ""}</td><td>${notes.start}</td></tr>
          ${stops
        .map(
          (s, i) =>
            `<tr><td>Stop ${i + 1}</td><td>${s.place_name}</td><td>${notes.stops[i] || ""}</td></tr>`
        )
        .join("")}
          <tr><td>Destination</td><td>${destination?.place_name || ""}</td><td>${notes.destination}</td></tr>
        </tbody>
      </table>
    `;
    const win = window.open("", "_blank");
    win.document.write(printContent);
    win.document.close();
    win.print();
  };

  // Optimize button simulation
  const handleFinish = () => {
    setIsLoading(true);
    setTimeout(() => {
      message.success("Route optimized!");
      setShowMap(true);
      setIsLoading(false);
    }, 1000);
  };

  // const handleCancel = () => dispatch(hideRouteForm()); 

  const createRouteOptimizeCheck = async () => {
    setIsLoading(true);
    const endPoint = `routes/route/limit`;
    const response = await dataGet_(endPoint, {})

    if (response?.data?.success) {
      handleOptimize();
    } else {
      message.error(response?.data?.message)
      setIsLoading(false);
    }

  }

  const handleOptimize = async () => {
    // console.log("Click");
    // saveStopsToDB()
    // return
    // await handleSaveAddresses()
    let waypoints = [start, ...stops, destination].filter(Boolean);
    if (options?.roundTrip) {
      waypoints = [start, ...stops, destination,start].filter(Boolean);
    }
    if (waypoints.length < 2) {
      console.error("At least 2 waypoints are required for optimization.");
      return;
    }

    // Format waypoints for the backend
    const formattedWaypoints = waypoints.map((wp) => ({
      lat: wp.coordinates[1],
      lng: wp.coordinates[0],
    }));

    try {
      setIsLoading(true);

      // Step 1: Optimize waypoints using /create-optimization
      const endPoint = `routes/optimize`;
      const optimizeResponse = await dataPost(endPoint, {
        waypoints: formattedWaypoints,
        destination: destination ? true : false
      })
      // const optimizeResponse = await axios.post(hostUrl + "users/create-optimization", {
      //   waypoints: formattedWaypoints,
      //   destination: destination ? true : false
      // });

      const optimizedWaypoints = optimizeResponse.data.optimizedWaypoints;

      if (!optimizedWaypoints || optimizedWaypoints.length === 0) {
        throw new Error("No optimized waypoints found.");
      }

      // Step 2: Fetch the optimized route using /get-optimized-route
      await fetchOptimizedRoute(optimizedWaypoints);
      let stopD = [...stops]
      // Update stops with optimized order
      let optimizedStops = optimizedWaypoints
        .slice(1, destination ? -1 : undefined)
        .map((wp, index) => ({
          place_name: stops[parseInt(wp.id.replace('destination', '')) - 1]?.place_name || `Stop ${index + 1}`,
          coordinates: [
            stops[parseInt(wp.id.replace('destination', '')) - 1].coordinates[0],
            stops[parseInt(wp.id.replace('destination', '')) - 1].coordinates[1]
          ],
          status: 'pending',
          name: stopD[index]?.name,
          startTime: '',
          notes: '',
          completeLat: '',
          completeLng: '',
          completeTime: '',
          profDelivery: '',
          signature: ''
        }));

      if (options.reverseOrder) {
        optimizedStops.reverse();
      }
      let reorderedNotes = optimizedWaypoints
        .slice(1, destination ? -1 : undefined)
        .map((wp) => notes.stops.find((note, i) => i === parseInt(wp.id.replace('destination', '')) - 1) || "");

      if (options.reverseOrder) {
        reorderedNotes.reverse();
      }

      setNotes((prev) => ({
        ...prev,
        stops: reorderedNotes,
      }));
      //  setNotes((prev) => ({
      //   ...prev,
      //   stops: reorderedNotes,
      // }));
      setStops(optimizedStops);
      await setDuration(optimizeResponse.data.duration)
      await setDistance(optimizeResponse.data.distance)

    } catch (error) {
      console.error("Error optimizing route:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (routeGeom && distance && duration && isRouteCreate) {
      saveDraftData(null);
    }
  }, [duration, distance, routeGeom, isRouteCreate]);

  const fetchOptimizedRoute = async (optimizedWaypoints) => {
    try {
      const endPoint = `users/get-optimized-route`;
      const response = await dataPost(endPoint, {
        optimizedWaypoints
      })
      // const response = await axios.post(hostUrl + "users/get-optimized-route", {
      //   optimizedWaypoints,
      // });
      const routeData = response?.data?.route;
      console.log("R", routeData);

      setRouteGeom(routeData); // Set the GeoJSON data for the route
      if (!isUpdate) {
        setIsRouteCreate(true)
      }
      setShowMap(true)

      //setDuration(routeData.properties.summary.duration / 3600); // Convert duration to hours
      //setDistance(routeData.properties.summary.length / 1000); // Convert distance to kilometers
    } catch (error) {
      console.error("Error fetching optimized route:", error);
    }
  };

  const handleSaveAddresses = async () => {
    const addresses = [];

    if (notes.start && start) {
      addresses.push({ customer: notes.start, address: start.place_name, lat: start.coordinates[1], lon: start.coordinates[0] });
    }

    stops.forEach((stop, index) => {
      if (notes.stops[index]) {
        addresses.push({ customer: notes.stops[index], address: stop.place_name, lat: stop.coordinates[1], lon: stop.coordinates[0] });
      }
    });

    if (notes.destination && destination) {
      addresses.push({ customer: notes.destination, address: destination.place_name, lat: destination.coordinates[1], lon: destination.coordinates[0] });
    }

  }

  const saveDraftData = async (isDriver) => {
    setIsLoading(true);

    await saveStopsToDB(); // 🔹 Save stops to DB first

    const startPoint = {
      latitude: start?.coordinates[1],
      longitude: start?.coordinates[0],
      address: start?.place_name
    };

    const endPointAddress = {
      latitude: destination?.coordinates[1],
      longitude: destination?.coordinates[0],
      address: destination?.place_name,
      status: 'pending', name: '', startTime: '', notes: '', completeLat: '', completeLng: '', completeTime: '', profDelivery: '', signature: ''
    };

    const stops12 = stops.map((stop) => stop.coordinates);

    const endPoint = `routes/create`;
    let data1 = {
      routeId: routeIdGen,
      name: routeName,
      startPoint: startPoint,
      endPoint: endPointAddress?.latitude ? endPointAddress : null,
      scheduleDate: scheduleDate,
      scheduleTime: scheduleTime,
      isRound: options?.roundTrip,
      isReverse: options?.reverseOrder,
      stops: stops12,
      stopsData: stops,
      routeGeometry: routeGeom,
      duration: duration,
    };

    const response = await dataPost(endPoint, data1);
    setIsRouteCreate(false)
    message.success('Route Created Successfully');
    setIsLoading(false);
  };

  const updateDraftData = async (isDriver) => {
    setIsLoading(true);

    await saveStopsToDB(); // 🔹 Save stops to DB first

    const startPoint = {
      latitude: start?.coordinates[1],
      longitude: start?.coordinates[0],
      address: start?.place_name
    };

    const endPointAddress = {
      latitude: destination?.coordinates[1],
      longitude: destination?.coordinates[0],
      address: destination?.place_name,
      status: 'pending', name: '', startTime: '', notes: '', completeLat: '', completeLng: '', completeTime: '', profDelivery: '', signature: ''
    };

    const stops12 = stops.map((stop) => stop.coordinates);

    const endPoint = `routes/admin/update/${routeDetail?._id}`;
    let data1 = {
      routeId: routeIdGen,
      name: routeName,
      startPoint: startPoint,
      endPoint: endPointAddress?.latitude ? endPointAddress : null,
      scheduleDate: scheduleDate,
      scheduleTime: scheduleTime,
      isRound: options?.roundTrip,
      isReverse: options?.reverseOrder,
      stops: stops12,
      stopsData: stops,
      routeGeometry: routeGeom,
      duration: duration,
    };

    const response = await dataPut(endPoint, data1)
    if (isDriver) {
      assignDriverFun(response?.data?.data?._id, isDriver)
      return
    }
    navigate('/route/list');
    message.success('Route Updated Successfully');
    setIsLoading(false);
  };

  const assignDriverFun = async (routeId, selectedDriver) => {
    const endPoint = `routes/assign/update/${routeId}/${selectedDriver}`;
    const res = await dataPut(endPoint, {});
    if (isUpdate) {
      navigate('/route/list');
    }
    message.success(isUpdate ? 'Route Updated Successfully' : 'Route Created Successfully');
    setIsLoading(false);
  }


  const saveStopsToDB = async () => {
    for (let stop of stops) {
      // console.log("Stops", stop);

      if (stop.name && stop.place_name && stop.coordinates) {
        const response = await dataPost("routes/admin/stop/save", {
          name: stop.name,
          place_name: stop.place_name,
          coordinates: stop.coordinates
        });
        console.log("sto[ response", response);

        if (response?.success) {
          console.log("Stop saved:", response.data);
        }
      }
    }
  };


  const handleSwitchChange = (key, value) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  return (
    <>
      {!showMap ? (
        <div className="route-form-container-main">
          <div className="route-form-container">
            <div className="route-header">
              <div className="route-icon">
                <img src={new_route_icon} alt="Route" width={50} height={50} />
              </div>
              <Title level={3}>{isUpdate ? "Update Route" : "New Route"}</Title>
              <Paragraph>
                Sorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Paragraph>
            </div>

            <Tabs defaultActiveKey="1" centered className="route-tabs">
              <TabPane tab="Manual Entry" key="1">
                <Form layout="vertical">
                  <div className="form-grid">
                    <Form.Item label="Auto Route ID">
                      <Input placeholder="#R1234" disabled value={routeIdGen}

                      />
                    </Form.Item>
                    <Form.Item label="Route Name (optional)">
                      <Input placeholder="Name"
                        value={routeName}
                        onChange={(e) => { setRouteName(e.target.value) }}
                      />
                    </Form.Item>

                    {/* Start Point Autocomplete */}
                    <Form.Item label="Start Point">
                      <AutoComplete
                        placeholder="Enter start point"
                        value={start?.place_name || queries.start}   // ✅ pre-fill from update data
                        onChange={(v) => {
                          setQueries({ ...queries, start: v })
                          setStart({ ...start, place_name: v })
                        }}
                        onSearch={handleSearch}
                        onSelect={(val, opt) => handleSelect(val, opt, "start")}
                        options={renderOptions()}
                      />
                    </Form.Item>

                    {/* Destination Autocomplete */}
                    <Form.Item label="End Point (optional)">
                      <AutoComplete
                        placeholder="Enter end point"
                        disabled={options?.roundTrip}
                        value={destination?.place_name || queries.destination}  // ✅ pre-fill
                        onChange={(v) => {
                          setQueries({ ...queries, destination: v })
                          setDestination({ ...destination, place_name: v })
                        }}
                        onSearch={handleSearch}
                        onSelect={(val, opt) => handleSelect(val, opt, "destination")}
                        options={renderOptions()}
                      />
                    </Form.Item>

                    <Form.Item label="Scheduled Date">
                      <DatePicker
                        suffixIcon={<CalendarOutlined />}
                        style={{ width: "100%" }}
                        value={scheduleDate}   // ✅ pre-fill
                        onChange={(e) => {
                          setScheduleDate(e)

                          console.log("E", e);

                        }}
                      />
                    </Form.Item>
                    <Form.Item label="Scheduled Time">
                      <TimePicker
                        suffixIcon={<ClockCircleOutlined />}
                        value={scheduleTime}   // ✅ pre-fill
                        style={{ width: "100%" }}
                        onChange={(e) => { setScheduleTime(e) }}
                      />
                    </Form.Item>
                  </div>

                  {/* Switches */}
                  <div className="route-options">
                    <div className="switch-group">
                      <Switch
                        checked={options.roundTrip}
                        onChange={(checked) => handleSwitchChange("roundTrip", checked)}
                      />
                      <span className="switch-label">Round Trip</span>
                      <div className="switch-subtext">Return to starting location</div>
                    </div>
                    <div className="switch-group">
                      <Switch
                        checked={options.reverseOrder}
                        onChange={(checked) => handleSwitchChange("reverseOrder", checked)}
                      />
                      <span className="switch-label">Reverse Order</span>
                      <div className="switch-subtext">Reverse stop sequence</div>
                    </div>
                  </div>

                  {/* Stops Section */}
                  {/* Stops Section */}
                  <div className="stop-block">
                    <Title level={5}>Stops</Title>

                    {stops.map((stop, index) => (
                      <Card
                        key={index}
                        className="stop-card"
                        bordered={false}
                        bodyStyle={{ padding: "16px 24px" }}
                      >
                        <div className="stop-header">
                          <Title level={5}>{`Stop ${index + 1}`}</Title>
                          <Button
                            danger
                            type="text"
                            onClick={() => handleRemoveLocation("stop", index)}
                          >
                            Delete Stop
                          </Button>
                        </div>
                        <Form.Item label="Client/Location Name">
                          <AutoComplete
                            placeholder="Enter client/location name"
                            value={stop.name || ""}
                            onSearch={handleSearchFromDb}   // 🔹 let AutoComplete trigger search
                            onChange={(v) => {
                              const updated = [...stops];
                              updated[index] = { ...updated[index], name: v };
                              setStops(updated);
                            }}
                            onSelect={(val, opt) => {
                              const updated = [...stops];
                              updated[index] = {
                                ...updated[index],
                                name: opt.result.name,
                                place_name: opt.result.place_name,
                                coordinates: opt.result.coordinates,
                                status: "pending",
                                startTime: "",
                                notes: "",
                                completeLat: "",
                                completeLng: "",
                                completeTime: "",
                                profDelivery: "",
                                signature: "",
                              };
                              setStops(updated);
                            }}
                            options={renderOptionsName()}
                            filterOption={false}   // 🔹 must add for async
                          />
                        </Form.Item>
                        {/* Address */}
                        <Form.Item label="Address">
                          <AutoComplete
                            placeholder="Address"
                            value={stop.place_name}
                            onChange={(v) => {
                              const updated = [...stops];
                              updated[index] = { ...updated[index], place_name: v };
                              setStops(updated);
                            }}
                            onSearch={handleSearch}
                            onSelect={(val, opt) => {
                              const updated = [...stops];
                              updated[index] = {
                                ...updated[index],
                                place_name: opt.result.place_name,
                                // name: opt.result.name || val,
                                coordinates: opt.result.geometry.coordinates,
                                status: 'pending', startTime: '', notes: '', completeLat: '', completeLng: '', completeTime: '', profDelivery: '', signature: ''
                              };
                              setStops(updated);
                              const allHaveCoordinates = updated.every(
                                (stop) =>
                                  stop.coordinates &&
                                  Array.isArray(stop.coordinates) &&
                                  stop.coordinates.length === 2 &&
                                  stop.coordinates[0] != null &&
                                  stop.coordinates[1] != null
                              );

                              if (allHaveCoordinates) {
                                console.log("✅ All stops have valid coordinates");
                                setIsButtonDisabled(false)
                              } else {
                                console.log("⚠️ Some stops are missing coordinates");
                                setIsButtonDisabled(true)
                              }
                            }}

                            options={renderOptions()}
                          />
                        </Form.Item>

                        {/* Time Window & Client/Location Name */}
                        <div style={{ display: "flex", gap: "16px" }}>
                          <Form.Item label="Time Window (optional)" style={{ flex: 1 }}>
                            <TimePicker.RangePicker style={{ width: "100%" }} />
                          </Form.Item>

                        </div>

                        {/* Notes */}
                        <Form.Item label="Notes">
                          <Input.TextArea
                            rows={2}
                            placeholder="Write Notes"
                            value={notes.stops[index] || ""}
                            onChange={(e) => handleNotesChange(e.target.value, "stop", index)}
                          />
                        </Form.Item>
                      </Card>
                    ))}

                    {/* Add Stop Button */}
                    <Button
                      type="dashed"
                      block
                      style={{ width: '20%', marginTop: 20 }}
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setStops([...stops, { place_name: "", name: "", coordinates: null, status: 'pending', startTime: '', notes: '', completeLat: '', completeLng: '', completeTime: '', profDelivery: '', signature: '' }]);
                        setNotes((prev) => ({ ...prev, stops: [...prev.stops, ""] }));
                        setIsButtonDisabled(true)
                      }}
                    >
                      Add Stops
                    </Button>
                  </div>


                  {/* Action Buttons */}
                  <div className="action-buttons">
                    {/* <Button onClick={handleCancel} className="cancel-btn">
                    Cancel
                  </Button> */}
                    <Button type="primary" disabled={isButtonDisable} className="optimize-btn" onClick={createRouteOptimizeCheck}>
                      {loading ? "Optimizing Route..." : "Optimize Route"}
                    </Button>
                    {/* <Tooltip title="Export to CSV">
                      <Button icon={<ExportOutlined />} onClick={exportToCSV} />
                    </Tooltip>
                    <Tooltip title="Print to PDF">
                      <Button icon={<PrinterOutlined />} onClick={printToPDF} />
                    </Tooltip> */}
                  </div>
                </Form>
              </TabPane>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="map-layout">
          <div className="map-section">
            <AssignDriver
              routeGeometry={routeGeom} // Pass GeoJSON data to MapComponent
              start={start?.coordinates}
              stops={stops.map((stop) => stop.coordinates)}
              stopData={stops}
              destination={options?.roundTrip ? [start?.coordinates[0] + 0.1, start?.coordinates[1] + 0.016] : destination?.coordinates}
              // destination={start?.coordinates}
              routeName={routeName}
              routeId={routeIdGen}
              startPoint={start?.place_name}
              endPoint={options?.roundTrip ? start?.place_name : destination?.place_name}
              dateSchedule={moment(scheduleDate).format('DD MMM YYYY')}
              timeSchedule={moment(scheduleTime).format('hh:mm')}
              isUpdate={isUpdate}
              loading={loading}
              onClickAssign={() => { }}
              exportToCSV={() => { exportToCSV() }}
              printToPDF={() => { printToPDF() }}
              onClickSave={(val) => {
                updateDraftData(val)

              }}


            />
          </div>
        </div>
      )}
    </>
  );
};

export default RouteForm;
