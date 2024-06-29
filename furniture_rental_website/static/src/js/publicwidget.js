odoo.define('service_based_planning.slotsManagement', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');
    var ajax = require('web.ajax');
    var session = require('web.session');
    var rpc = require('web.rpc');
    const Dialog = require('web.Dialog');
    const {_t, qweb} = require('web.core');

    publicWidget.registry.slotsManagement = publicWidget.Widget.extend({
        selector: '#product_detail',
        events: {
            'change #slot_date': '_onClickSlotDate',
            'click #fill_form_details' : '_onClickServiceDetail'
        },
        async _onClickSlotDate(ev){
            var productId = $('.product_id').val()
            var selectedDate = $('#slot_date').val();
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
                            'product_id': productId
                        },
                        success: function(response) {
                            var timeSlots = response.replace(/[\[\]"]/g, '').split(',');
                            $('.service_product').remove();
                            $('.no-slots').remove();
                            console.log(timeSlots.length)
                            if (timeSlots.length > 1) {
                                var timeSlotsDiv = $('<div>').addClass('service_product d-flex flex-wrap align-items-center');
                                var divFormGroup = $('<div>').addClass('form-group mb-3 d-flex align-items-center').appendTo(timeSlotsDiv);
                                $('<b style="flex: 0 0 150px;">').addClass('col-12 col-md-3').text('Available Timeslots:').appendTo(divFormGroup);

                                var slotsPerLine = 3;
                                var lineCounter = 0;

                                var inputsLabelsDiv = $('<div>').addClass('inputs-labels-div').css({flexWrap: 'wrap', display: 'flex'}); // New div to wrap inputs and labels

                                timeSlots.forEach(function(timeSlot) {
                                if (lineCounter === slotsPerLine) {
                                    // $('<br>').appendTo(timeSlotsDiv);
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
        },
        
        _onClickServiceDetail(ev){
            var self = this
            ev.preventDefault();
            const dialog = new Dialog(this, {
                title: _t("Service Details"),
                $content: qweb.render('service_based_planning.service_details'),
                buttons: [
                    {
                        text: _t("Save"),
                        classes: 'btn-primary',
                        click: async () => {
                            $('#car_model_main').val($('#car_model').val())
                            $('#manufacture_year_main').val($('#manufacture_year').val())
                            $('#license_plate_main').val($('#license_plate').val())
                            $('#wheel_lock_yes').val($('#wheel_lock_yes').val())
                            $('#wheel_lock_no_main').val($('#wheel_lock_no').val())
                            $('#odometer_main').val($('#odometer').val())
                            $('#parts_main').val($('#parts').val())
                        },
                        close: true,
                    },
                    {
                        text: _t("Discard"),
                        close: true,
                    },
                ],
            });
            dialog.on('closed', this, function () {console.log("called")});
            dialog.open();
        }
    });
    return publicWidget.registry.slotsManagement;
});
