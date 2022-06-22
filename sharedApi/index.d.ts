declare namespace api {
  namespace auth {
    type request = { user: string };
    type response = {};
  }

  namespace getTickets {
    type request = {};
    type response = {
      [id: string]: {
        text: string;
        screenY: number;
        screenX: number;
        user?: string;
      };
    };
  }

  namespace putTicket {
    type request = {
      id: string;
      text: string;
      screenY: number;
      screenX: number;
    };
    type response = {};
  }

  namespace patchTicket {
    type request = {
      id: string;
      text?: string;
      screenY?: number;
      screenX?: number;
    };
    type response = {};
  }
}
