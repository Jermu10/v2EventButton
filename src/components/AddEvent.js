import React, { useState } from "react";
import {
  Button,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import dayjs from "dayjs";

export default function AddEvent() {
  // State to manage the event form fields
  const [event, setEvent] = useState({
    date: dayjs(),
    startingTime: "",
    endingTime: "",
    title: "",
    description: "",
  });
  // State to store the list of events
  const [eventList, setEventList] = useState([]);
  // State to manage the expanded event in the accordion
  const [expandedEvent, setExpandedEvent] = useState(null);
  // State to control the open/close state of the dialog
  const [open, setOpen] = useState(false);
  // Open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };
  // Close the dialog and reset event form fields
  const handleClose = () => {
    setOpen(false);
    setEvent({
      date: dayjs(),
      startingTime: "",
      endingTime: "",
      title: "",
      description: "",
    });
  };
  // Handle accordion expansion/collapse
  const handleAccordionChange = (index) => (event, isExpanded) => {
    setExpandedEvent(isExpanded ? index : null);
  };
  // Handle date change in the date picker
  const handleDateChange = (date) => {
    setEvent({ ...event, date: date });
  };
    // Handle changes in the time pickers
    const handleStartingTimeChange = (time) => {
        setEvent((prevEvent) => ({
          ...prevEvent,
          startingTime: time,
        }));
      };
    
      const handleEndingTimeChange = (time) => {
        setEvent((prevEvent) => ({
          ...prevEvent,
          endingTime: time,
        }));
      };
  // Handle input changes in the text fields
  const handleInputChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };
  // Add an event to the list
  const addEvent = () => {
    if (dayjs(event.startingTime).isAfter(dayjs(event.endingTime))) {
      alert("Starting time must be before ending time");
      return;
    }

    const newEvent = { ...event };
    setEventList([...eventList, newEvent]);
    setEvent({
      date: dayjs(),
      startingTime: "",
      endingTime: "",
      title: "",
      description: "",
    });
    handleClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        style={{
          marking: 10,
          color: "white",
          backgroundColor: "black",
          display: "flex",
        }}
        onClick={handleClickOpen}
      >
        Add Event
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            <div className="formInput">
              <DatePicker
                label="Date"
                minDate={dayjs()}
                onChange={handleDateChange}
                value={event.date}
                input={(params) => <TextField {...params} />}
              />
            </div>
            <br />
            <div className="formInput">
              <TimePicker
                label="Starting time"
                onChange={handleStartingTimeChange}
                input={(params) => <TextField {...params} />}
              />
            </div>
            <div className="formInput">
              <TimePicker
                label="Ending time"
                onChange={handleEndingTimeChange}
                input={(params) => <TextField {...params} />}
              />
            </div>
          </LocalizationProvider>
          <TextField
            autoFocus
            name="title"
            value={event.title}
            onChange={handleInputChange}
            label="Title"
            fullWidth
            margin="dense"
          />
          <TextField
            autoFocus
            name="description"
            value={event.description}
            onChange={handleInputChange}
            label="Description"
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={addEvent} color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <h2>Events</h2>
        {eventList.map((event, index) => {
          const durationStartingTime = event.startingTime;
          const durationEndTime = event.endingTime;
          const duration =
            dayjs(durationEndTime).diff(durationStartingTime, "hour") +
            " hours " +
            (dayjs(durationEndTime).diff(durationStartingTime, "minute") % 60) +
            " minutes";

          return (
            <Accordion
              key={index}
              expanded={expandedEvent === index}
              onChange={handleAccordionChange(index)}
            >
              <AccordionSummary>
                <h3>{event.title}</h3>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <p>Description: {event.description}</p>
                  <p>Date: {event.date.format("YYYY-MM-DD")}</p>
                  <p>Starting Time: {event.startingTime.format("HH:mm")}</p>
                  <p>Ending Time: {event.endingTime.format("HH:mm")}</p>
                  <p>Duration: {duration}</p>
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}