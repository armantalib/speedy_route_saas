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
import { dataGet_, dataPost } from "../../utils/myAxios";
import { useNavigate } from 'react-router-dom';

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
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [customerStopId, setCustomerStopId] = useState(null);
  const navigate = useNavigate();

  // Search via Mapbox
  const handleSearch = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
        { params: { access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN, limit: 5 } }
      );
      setSearchResults(response.data.features);
    } catch (err) {
      console.error("Mapbox search error:", err);
    }
  };

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

    const randomNumber = Math.floor(Math.random() * 1111111)
    const routeNum = 'R' + randomNumber
    setRouteIdGen(routeNum)
  }, [])


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
    } else if (type === "destination") setDestination({ coordinates, place_name, status: 'pending', startTime: '', notes: '', completeLat: '', completeLng: '', completeTime: '', profDelivery: '', signature: '' });

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

  const handleOptimize = async () => {
    // console.log("Click");
    // saveStopsToDB()
    // return
    // await handleSaveAddresses()
    const waypoints = [start, ...stops, destination].filter(Boolean);
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
      const optimizedStops = optimizedWaypoints
        .slice(1, destination ? -1 : undefined) // Only slice the last item if destination exists
        .map((wp, index) => ({
          place_name: stops[parseInt(wp.id.replace('destination', '')) - 1]?.place_name || `Stop ${index + 1}`, // Preserve original place name
          coordinates: [stops[parseInt(wp.id.replace('destination', '')) - 1].coordinates[0], stops[parseInt(wp.id.replace('destination', '')) - 1].coordinates[1]],
          status: 'pending',
          name:stopD[index]?.name
          , startTime: '', notes: '', completeLat: '', completeLng: '', completeTime: '', profDelivery: '', signature: ''
        }));
      const reorderedNotes = optimizedWaypoints
        .slice(1, destination ? -1 : undefined)
        .map(
          (wp) => notes.stops.find((note, i) => i === parseInt(wp.id.replace('destination', '')) - 1) || ""
        )

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

  const fetchOptimizedRoute = async (optimizedWaypoints) => {
    try {
      const endPoint = `users/get-optimized-route`;
      const response = await dataPost(endPoint, {
        optimizedWaypoints
      })
      // const response = await axios.post(hostUrl + "users/get-optimized-route", {
      //   optimizedWaypoints,
      // });
      const routeData = response.data.route;
      console.log("R", routeData);

      setRouteGeom(routeData); // Set the GeoJSON data for the route
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

  const saveDraftData = async () => {
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
      isRound: false,
      stops: stops12,
      stopsData: stops,
      routeGeometry: routeGeom,
      duration: duration,
    };

    const response = await dataPost(endPoint, data1);
    navigate('/route/list');
    message.success('Route Created Successfully');
    setIsLoading(false);
  };


  const saveStopsToDB = async () => {
    for (let stop of stops) {
      console.log("Stops", stop);

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




  return (
    <>
      {!showMap ? (
        <div className="route-form-container-main">
          <div className="route-form-container">
            <div className="route-header">
              <div className="route-icon">
                <img src="./src/assets/icons/svg/csr-pin-location.svg" alt="Route" />
              </div>
              <Title level={3}>New Route</Title>
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
                        onChange={(e) => { setRouteName(e.target.value) }}
                      />
                    </Form.Item>

                    {/* Start Point Autocomplete */}
                    <Form.Item label="Start Point" name="startPoint">
                      <AutoComplete
                        placeholder="Enter start point"
                        value={queries.start}
                        onChange={(v) => setQueries({ ...queries, start: v })}
                        onSearch={handleSearch}
                        onSelect={(val, opt) => handleSelect(val, opt, "start")}
                        options={renderOptions()}
                      />
                    </Form.Item>

                    {/* Destination Autocomplete */}
                    <Form.Item label="End Point (optional)" name="endPoint">
                      <AutoComplete
                        placeholder="Enter end point"
                        value={queries.destination}
                        onChange={(v) => setQueries({ ...queries, destination: v })}
                        onSearch={handleSearch}
                        onSelect={(val, opt) => handleSelect(val, opt, "destination")}
                        options={renderOptions()}
                      />
                    </Form.Item>

                    <Form.Item label="Scheduled Date" name="scheduleDate">
                      <DatePicker
                        suffixIcon={<CalendarOutlined />}
                        style={{ width: "100%" }}
                        onChange={(e) => {
                          setScheduleDate(e)

                          console.log("E", e);

                        }}
                      />
                    </Form.Item>
                    <Form.Item label="Scheduled Time" name="scheduleTime">
                      <TimePicker
                        suffixIcon={<ClockCircleOutlined />}
                        style={{ width: "100%" }}
                        onChange={(e) => { setScheduleTime(e) }}
                      />
                    </Form.Item>
                  </div>

                  {/* Switches */}
                  <div className="route-options">
                    <div className="switch-group">
                      <Switch />
                      <span className="switch-label">Round Trip</span>
                      <div className="switch-subtext">Return to starting location</div>
                    </div>
                    <div className="switch-group">
                      <Switch />
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
                              updated[index].place_name = v;
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
                    <Button type="primary" className="optimize-btn" onClick={handleOptimize}>
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
              destination={destination?.coordinates}
              routeName={routeName}
              routeId={routeIdGen}
              startPoint={start?.place_name}
              endPoint={destination?.place_name}
              dateSchedule={moment(scheduleDate).format('DD MMM YYYY')}
              timeSchedule={moment(scheduleTime).format('hh:mm')}
              loading={loading}
              exportToCSV={() => { exportToCSV() }}
              printToPDF={() => { printToPDF() }}
              onClickSave={() => {
                saveDraftData()

              }}


            />
          </div>
        </div>
      )}
    </>
  );
};

export default RouteForm;
