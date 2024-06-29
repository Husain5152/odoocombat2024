$(document).ready(function () {
    var customDateField = $('#custom_date');


    $("a.btn.btn-primary.float-end.s_website_form_send").on("click", function() {
        event.preventDefault();

        if ($(".time_slots:checked").length === 0) {
            // No time slot selected
            alert("Please select a time slot.");
            return false; // Prevent the button action
        }

        // Get the selected time slot value
        var selectedTimeSlot = $('input[name="number"]:checked').val();

        // Get the custom date value
        var selectedDate = $('#custom_date').val();

        // Get all the other fields and add it in json
        var carModel = $('#car_model').val();
        var manufactureYear = $('#manufacture_year').val();
        var licensePlate = $('#license_plate').val();
        var wheelLock = $('input[name="wheel_lock"]:checked').val();
        var odometer = $('#odometer').val();
        var parts = $('#parts').val();

        // Create a JSON object with field names and values
        var vehicleData = [
          { name: "Car Model", value: carModel },
          { name: "Manufacture Year", value: manufactureYear },
          { name: "License Plate", value: licensePlate },
          { name: "Wheel Lock", value: wheelLock },
          { name: "Odoometer", value: odometer },
          { name: "Parts", value: parts }
        ];

        // Convert the data array to a JSON string
        var jsonData = JSON.stringify(vehicleData);

        // Modify the href of the "Next" button with the data
        var href = '/shop/confirm_order?selected_date=' + selectedDate + '&time_slot=' + selectedTimeSlot + '&vehicle_data=' + jsonData;
        $(this).attr('href', href);

        // Proceed to the next step
        window.location.href = href;

        });

    $(document).on("change", "#custom_date", function () {
        var selectedDate = $(this).val();
//        var productTemplateId = $('.product_template_id').val();
        var tdElement = $("td.td-img.text-center");
        var Model = tdElement.find("span").data("oe-model");
        var productId = tdElement.find("span").data("oe-id");

        var imgTag = $("td.td-img.text-center").find('img');
        var url = imgTag.attr('src');
        var id = url.split('/')[4];


        var currentDate = new Date(); // Get the current date

        var selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(0, 0, 0, 0); // Set the time of selected date to midnight

        var currentDateTime = new Date();
        currentDateTime.setHours(0, 0, 0, 0); // Set the time of current date to midnight


        if (selectedDateTime < currentDateTime) {
          $('.service_product').remove();
          alert("Please select a Valid Date.");
          $(this).val("");
        }
        else {
          $.ajax({
                type: "GET",
                url: '/product/timeslots',
                data: {
                    'selected_date': selectedDate,
                    'product_id': productId || id
                },
                success: function(response) {

                    var timeSlots = response.replace(/[\[\]"]/g, '').split(',');

                    $('.service_product').remove();
                    $('.no-slots').remove();
                    console.log(timeSlots.length)
                    if (timeSlots.length > 1) {
                        var timeSlotsDiv = $('<div>').addClass('service_product d-flex flex-wrap align-items-center');
                        var divFormGroup = $('<div>').addClass('form-group mb-3 d-flex align-items-center').appendTo(timeSlotsDiv);
                        $('<b style="flex: 0 0 250px;">').addClass('col-12 col-md-3').text('Available Timeslots:').appendTo(divFormGroup);

                        var slotsPerLine = 3;
                        var lineCounter = 0;

                        var inputsLabelsDiv = $('<div>').addClass('inputs-labels-div').css({flexWrap: 'wrap', display: 'flex'}); // New div to wrap inputs and labels

                        timeSlots.forEach(function(timeSlot) {
                          if (lineCounter === slotsPerLine) {
                            $('<br>').appendTo(timeSlotsDiv);
                            lineCounter = 0;
                          }

                          var radioInput = $('<input>').addClass('time_slots').attr({
                            type: 'radio',
                            class: 'me-2 time_slots',
                            option: 'select',
                            name: 'number',
                            value: timeSlot,
                            required: selectedDate ? true : false
                          });

                          var label = $('<label>').addClass('me-4').attr('for', timeSlot).text(timeSlot);
                          var inputLabelDiv = $('<div>').addClass('d-flex align-items-center nnnnnn').append(radioInput, label);
                          inputsLabelsDiv.append(inputLabelDiv); // Append input and label to the new div

                          lineCounter++;
                        });

                        divFormGroup.append(inputsLabelsDiv);


                        if (lineCounter < slotsPerLine) {
                          for (var i = lineCounter; i < slotsPerLine; i++) {
                            $('<span>').css('visibility', 'hidden').appendTo(timeSlotsDiv);
                          }
                        }

                        $('.custom-date-field').after(timeSlotsDiv);

                    } else {
                        var noSlotsDiv = $('<div>').addClass('no-slots').text('No slots available on this date');

                        $('.custom-date-field').after(noSlotsDiv);
                    }
                }
            });
        }

    });
});
