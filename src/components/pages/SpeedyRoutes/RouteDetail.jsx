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

const RouteDetail = () => {
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
  const [isUpdate, setIsUpdate] = useState(true);
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
      setIsButtonDisabled(false)
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
   
        <div className="map-layout">
          <div className="map-section">
            <AssignDriver
              routeGeometry={routeGeom} // Pass GeoJSON data to MapComponent
              start={start?.coordinates}
              stops={stops.map((stop) => stop.coordinates)}
              stopData={stops}
              destination={options?.roundTrip ? [start?.coordinates[0], start?.coordinates[1]] : destination?.coordinates}
              // destination={start?.coordinates}
              routeName={routeName}
              routeId={routeIdGen}
              startPoint={start?.place_name}
              endPoint={options?.roundTrip ? start?.place_name : destination?.place_name}
              dateSchedule={moment(scheduleDate).format('DD MMM YYYY')}
              timeSchedule={moment(scheduleTime).format('hh:mm')}
              isUpdate={isUpdate}
              loading={loading}
              isRouteDetail={true}
              onClickAssign={() => { }}
              exportToCSV={() => { exportToCSV() }}
              printToPDF={() => { printToPDF() }}
              onClickSave={(val) => {
                updateDraftData(val)

              }}


            />
          </div>
        </div>
    </>
  );
};

export default RouteDetail;
