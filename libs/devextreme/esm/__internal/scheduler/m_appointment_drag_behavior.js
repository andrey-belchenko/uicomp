/**
 * DevExtreme (esm/__internal/scheduler/m_appointment_drag_behavior.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    Deferred
} from "../../core/utils/deferred";
import {
    extend
} from "../../core/utils/extend";
import Draggable from "../../ui/draggable";
import {
    LIST_ITEM_DATA_KEY
} from "./m_constants";
import {
    isSchedulerComponent
} from "./utils/is_scheduler_component";
const APPOINTMENT_ITEM_CLASS = "dx-scheduler-appointment";
export default class AppointmentDragBehavior {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.workspace = this.scheduler._workSpace;
        this.appointments = this.scheduler._appointments;
        this.initialPosition = {
            left: 0,
            top: 0
        };
        this.appointmentInfo = null;
        this.dragBetweenComponentsPromise = null
    }
    isAllDay(appointment) {
        return appointment.data("dxAppointmentSettings").allDay
    }
    onDragStart(e) {
        const {
            itemSettings: itemSettings,
            itemData: itemData,
            initialPosition: initialPosition
        } = e;
        this.initialPosition = initialPosition;
        this.appointmentInfo = {
            appointment: itemData,
            settings: itemSettings
        };
        this.appointments.notifyObserver("hideAppointmentTooltip")
    }
    onDragMove(e) {
        if (e.fromComponent !== e.toComponent) {
            this.appointments.notifyObserver("removeDroppableCellClass")
        }
    }
    getAppointmentElement(e) {
        const itemElement = e.event.data && e.event.data.itemElement || e.itemElement;
        return $(itemElement)
    }
    onDragEnd(event) {
        const element = this.getAppointmentElement(event);
        const rawAppointment = this.appointments._getItemData(element);
        const container = this.appointments._getAppointmentContainer(this.isAllDay(element));
        container.append(element);
        const newCellIndex = this.workspace.getDroppableCellIndex();
        const oldCellIndex = this.workspace.getCellIndexByCoordinates(this.initialPosition);
        this.appointments.notifyObserver("updateAppointmentAfterDrag", {
            event: event,
            element: element,
            rawAppointment: rawAppointment,
            newCellIndex: newCellIndex,
            oldCellIndex: oldCellIndex
        })
    }
    onDragCancel() {
        this.removeDroppableClasses()
    }
    getItemData(appointmentElement) {
        const dataFromTooltip = $(appointmentElement).data(LIST_ITEM_DATA_KEY);
        const itemDataFromTooltip = null === dataFromTooltip || void 0 === dataFromTooltip ? void 0 : dataFromTooltip.appointment;
        const itemDataFromGrid = this.appointments._getItemData(appointmentElement);
        return itemDataFromTooltip || itemDataFromGrid
    }
    getItemSettings(appointment) {
        const itemData = $(appointment).data(LIST_ITEM_DATA_KEY);
        return itemData && itemData.settings || []
    }
    createDragStartHandler(options, appointmentDragging) {
        return e => {
            e.itemData = this.getItemData(e.itemElement);
            e.itemSettings = this.getItemSettings(e.itemElement);
            appointmentDragging.onDragStart && appointmentDragging.onDragStart(e);
            if (!e.cancel) {
                options.onDragStart(e)
            }
        }
    }
    createDragMoveHandler(options, appointmentDragging) {
        return e => {
            appointmentDragging.onDragMove && appointmentDragging.onDragMove(e);
            if (!e.cancel) {
                options.onDragMove(e)
            }
        }
    }
    createDragEndHandler(options, appointmentDragging) {
        return e => {
            const updatedData = this.appointments.invoke("getUpdatedData", e.itemData);
            this.appointmentInfo = null;
            e.toItemData = extend({}, e.itemData, updatedData);
            appointmentDragging.onDragEnd && appointmentDragging.onDragEnd(e);
            if (!e.cancel) {
                options.onDragEnd(e);
                if (e.fromComponent !== e.toComponent) {
                    appointmentDragging.onRemove && appointmentDragging.onRemove(e)
                }
            }
            if (true === e.cancel) {
                this.removeDroppableClasses()
            }
            if (true !== e.cancel && isSchedulerComponent(e.toComponent)) {
                const targetDragBehavior = e.toComponent._getDragBehavior();
                targetDragBehavior.dragBetweenComponentsPromise = new Deferred
            }
        }
    }
    createDropHandler(appointmentDragging) {
        return e => {
            const updatedData = this.appointments.invoke("getUpdatedData", e.itemData);
            e.itemData = extend({}, e.itemData, updatedData);
            if (e.fromComponent !== e.toComponent) {
                appointmentDragging.onAdd && appointmentDragging.onAdd(e)
            }
            if (this.dragBetweenComponentsPromise) {
                this.dragBetweenComponentsPromise.resolve()
            }
        }
    }
    addTo(container, config) {
        const appointmentDragging = this.scheduler.option("appointmentDragging") || {};
        const options = extend({
            component: this.scheduler,
            contentTemplate: null,
            filter: `.${APPOINTMENT_ITEM_CLASS}`,
            immediate: false,
            onDragStart: this.onDragStart.bind(this),
            onDragMove: this.onDragMove.bind(this),
            onDragEnd: this.onDragEnd.bind(this),
            onDragCancel: this.onDragCancel.bind(this)
        }, config);
        this.appointments._createComponent(container, Draggable, extend({}, options, appointmentDragging, {
            onDragStart: this.createDragStartHandler(options, appointmentDragging),
            onDragMove: this.createDragMoveHandler(options, appointmentDragging),
            onDragEnd: this.createDragEndHandler(options, appointmentDragging),
            onDrop: this.createDropHandler(appointmentDragging),
            onCancelByEsc: true
        }))
    }
    updateDragSource(appointment, settings) {
        const {
            appointmentInfo: appointmentInfo
        } = this;
        if (appointmentInfo || appointment) {
            const currentAppointment = appointment || appointmentInfo.appointment;
            const currentSettings = settings || appointmentInfo.settings;
            this.appointments._setDragSourceAppointment(currentAppointment, currentSettings)
        }
    }
    removeDroppableClasses() {
        this.appointments._removeDragSourceClassFromDraggedAppointment();
        this.workspace.removeDroppableCellClass()
    }
}
