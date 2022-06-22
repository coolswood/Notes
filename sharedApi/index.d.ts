declare namespace api {
  namespace auth {
    type request = { user: string };
    type response = {};
  }

  namespace swMessage {
    namespace getTickets {
      type frontMessage = { event: 'GET_TICKETS' };
      type backMessage = {
        [id: string]: {
          text: string;
          screenY: number;
          screenX: number;
          user?: string;
          color: string;
        };
      };
    }

    namespace putTicket {
      type frontMessage = {
        event: 'PUT_TICKET';
        data: {
          id: string;
          text: string;
          screenY: number;
          screenX: number;
          color: string;
        };
      };
    }

    namespace patchTicket {
      type frontMessage = {
        event: 'PATCH_TICKET';
        data: {
          id: string;
          text?: string;
          screenY?: number;
          screenX?: number;
        };
      };
    }
  }
}
