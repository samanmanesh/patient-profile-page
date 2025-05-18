import { Event } from '../types/event';

class EventsService {
  /**
   * Get all events
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await fetch('/data/events.json');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  /**
   * Get an event by ID
   */
  async getEventById(id: string): Promise<Event | null> {
    try {
      const response = await fetch('/data/events.json');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const events: Event[] = await response.json();
      return events.find(event => event.id === id) || null;
    } catch (error) {
      console.error(`Error getting event ${id}:`, error);
      return null;
    }
  }

  /**
   * Get events for a specific patient
   */
  async getEventsByPatientId(patientId: string): Promise<Event[]> {
    try {
      const response = await fetch('/data/events.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch events for patient ${patientId}`);
      }
      const events: Event[] = await response.json();
      
      // Filter events for the specific patient
      return events.filter(event => 
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
   * Create a new event - mocked implementation
   */
  async createEvent(eventData: Event): Promise<Event | null> {
    try {
      // In a real implementation, we would update the local data
      console.log('Create event called with:', eventData);
      
      // Return a mocked response with the event data and a generated ID
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
   * Update an existing event - mocked implementation
   */
  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
    try {
      // Get the current event
      const response = await fetch('/data/events.json');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const events: Event[] = await response.json();
      const existingEvent = events.find(event => event.id === id);
      
      if (!existingEvent) {
        throw new Error(`Event not found: ${id}`);
      }
      
      // Return the updated event (in a real app, we would save this)
      return {
        ...existingEvent,
        ...eventData
      };
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      return null;
    }
  }

  /**
   * Delete an event - mocked implementation
   */
  async deleteEvent(id: string): Promise<boolean> {
    try {
      // In a real implementation, we would update the local data
      console.log(`Delete event called with ID: ${id}`);
      
      // Simulate success
      return true;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      return false;
    }
  }

  /**
   * Create a new appointment event - mocked implementation
   */
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
    // Format as an event with appointment details
    const eventData = {
      ...appointmentData,
      type: 'APPOINTMENT',
      isAppointment: true,
      attendeeIds: [appointmentData.patientId, appointmentData.providerId],
    };
    
    return this.createEvent(eventData as unknown as Event);
  }
}

// Export as a singleton
export const eventsService = new EventsService(); 