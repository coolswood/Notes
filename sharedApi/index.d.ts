declare namespace api {
    namespace getTickets {
        type request = {};
        type response = {
            [id: string]:
                {
                    text: string; screenY: number; screenX: number, canEdit: boolean
                }
        };
    }

    namespace putTicket {
        type request = { id: string, text: string; screenY: number; screenX: number };
        type response = {};
    }
}