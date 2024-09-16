import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
  onDateSelected: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelected }) => {
  const [dates, setDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch("http://localhost:5000/dates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: localStorage.getItem("spotifyAccessToken"),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dateStrings = await response.json();

        // Convert date strings to Date objects
        const parsedDates = dateStrings.map(
          (dateString: string) => new Date(dateString)
        );
        setDates(parsedDates);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDates();
  }, []);

  const handleDateChange = (date: Date | null) => {
    if (
      date &&
      dates.some(
        (allowedDate) => allowedDate.toDateString() === date.toDateString()
      )
    ) {
      console.log("Selected date:", date);
      onDateSelected(date);
    } else {
      console.log("Invalid date selection");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <DatePicker
        selected={new Date()}
        onChange={handleDateChange}
        highlightDates={dates}
        filterDate={(date) =>
          dates.some(
            (allowedDate) => allowedDate.toDateString() === date.toDateString()
          )
        }
        inline
      />
    </div>
  );
};

export default Calendar;
