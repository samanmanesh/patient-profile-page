import { Event } from '../types/event';
import events from '../services/data/events.json';

class EventsService {

  async getAllEvents(): Promise<Event[]> {
    try {
      return events as unknown as Event[];
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }


  async getEventById(id: string): Promise<Event | null> {
    try {
      return events.find((event) => event.id === id) as unknown as Event | null;
    } catch (error) {
      console.error(`Error getting event ${id}:`, error);
      return null;
    }
  }


  async getEventsByPatientId(patientId: string): Promise<Event[]> {
    try {
      const eventsData = events as unknown as Event[];
      
      return eventsData.filter(event => 
        event.attendees.some(attendee => 
          attendee.user.id === patientId
        )
      );
    } catch (error) {
      console.error(`Error getting events for patient ${patientId}:`, error);
      return [];
    }
  }

  /**
   * Create a new event
   */
  async createEvent(eventData: Event): Promise<Event | null> {
    try {
      console.log('Create event called with:', eventData);
      
      return {
        ...eventData,
        id: `evt_${Math.random().toString(36).substring(2, 15)}`
      };
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
    try {
      const eventsData = events as unknown as Event[];
      const existingEvent = eventsData.find(event => event.id === id);
      
      if (!existingEvent) {
        throw new Error(`Event not found: ${id}`);
      }
      
      return {
        ...existingEvent,
        ...eventData
      };
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      return null;
    }
  }


  async deleteEvent(id: string): Promise<boolean> {
    try {
        console.log(`Delete event called with ID: ${id}`);
      
      return true;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      return false;
    }
  }


  async createAppointment(appointmentData: {
    patientId: string;
    providerId: string;
    title: string;
    reason: string;
    start: string;
    end: string;
    appointmentType: string;
    locationId?: string;
  }): Promise<Event | null> {
    const eventData = {
      ...appointmentData,
      type: 'APPOINTMENT',
      isAppointment: true,
      attendeeIds: [appointmentData.patientId, appointmentData.providerId],
    };
    
    return this.createEvent(eventData as unknown as Event);
  }
}

// export as a singleton
export const eventsService = new EventsService(); 