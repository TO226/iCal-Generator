$(function () {
  $.datepicker.setDefaults({
    changeMonth: "true",
    changeYear: "true",
    showButtonPanel: true,
    showAnim: "clip",
  });
  $("#from").datepicker({});

  $("#generateBtn").on("click", function () {
    const eventName = $("#eventName").val().trim();
    const eventLocation = $("#eventLocation").val().trim();
    const eventTime = $("#eventTime").val().trim();
    const eventDate = $("#from").datepicker("getDate");
    const eventDescription = $("#eventDescription").val().trim();

    if (!eventName || !eventTime || !eventDate) {
      alert("Please enter the event name, time, and date.");
      return;
    }

    const eventDateTime = new Date(eventDate);
    const [hours, minutes] = eventTime.split(":");
    eventDateTime.setHours(hours, minutes);

    const icalContent = generateICalContent(
      eventName,
      eventDateTime,
      eventLocation,
      eventDescription
    );
    const blob = new Blob([icalContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    $("#downloadLink")
      .attr("href", url)
      .attr("download", `${eventName}.ics`)
      .css("display", "block");
  });
});

function formatDateForICal(dt) {
  return dt.toISOString().replace(/[:-]/g, "").substring(0, 15) + "Z";
}

function generateICalContent(
  eventName,
  eventDateTime,
  eventLocation,
  eventDescription
) {
  const begin = formatDateForICal(eventDateTime);
  const end = formatDateForICal(
    new Date(eventDateTime.getTime() + 60 * 60 * 1000)
  );

  const icalContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${begin}`,
    `DTEND:${end}`,
    `SUMMARY:${eventName}`,
    `LOCATION:${eventLocation}`,
    `DESCRIPTION:${eventDescription}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  return icalContent;
}
