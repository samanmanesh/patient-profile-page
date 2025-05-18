import { Event } from '../types/event';

class EventsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  /**
   * Get all events
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/events`);
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
      const response = await fetch(`${this.baseUrl}/api/events/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      return await response.json();
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
      const response = await fetch(`${this.baseUrl}/api/events/patient/${patientId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events for patient ${patientId}`);
      }
      return await response.json();
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
      const response = await fetch(`${this.baseUrl}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }
      
      return await response.json();
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
      const response = await fetch(`${this.baseUrl}/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update event ${id}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      return null;
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/events/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete event ${id}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      return false;
    }
  }

  /**
   * Create a new appointment event
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