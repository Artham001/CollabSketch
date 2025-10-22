# CollabSketch: Real-Time Collaborative Whiteboard

A full-stack, real-time collaborative whiteboard application built with Node.js and Socket.IO to enable instant multi-user drawing and communication. This project features a responsive HTML5 Canvas, live chat, and a full suite of drawing tools for seamless brainstorming on any device.


## Project Showcase

(It is highly recommended to add a screenshot or, even better, a GIF here demonstrating the real-time collaboration.)

## Features

* **Real-Time Collaborative Drawing:** Any drawing made by one user appears instantly on the screens of all other connected users.
* **Live Chat:** A built-in chat allows for real-time text communication, with messages from the current user and other users styled differently for readability.
* **Comprehensive Drawing Tools:**
    * Brush & Eraser: Standard tools for drawing and removing content.
    * Color Picker: A simple interface to change the brush color.
    * Brush Size Slider: Dynamically adjust the thickness of the brush stroke.
    * Undo Functionality: Reverts the last line segment drawn by the user.
    * Clear Canvas: A single button to clear the entire whiteboard for all users.
* **Responsive & Mobile-Friendly:** The interface is designed to work on both desktop and mobile devices, with full support for touch events for drawing.

## Technology Stack

### Frontend
* **HTML5 Canvas:** Used for rendering all the drawings in a performant way.
* **Vanilla JavaScript (ES6+):** Handled all client-side logic, including drawing on the canvas, UI interactions, and WebSocket communication.
* **CSS3:** Styled the application and ensured a responsive layout.

### Backend
* **Node.js:** Provided the runtime environment for the server.
* **Express.js:** A minimal web framework used to serve the static front-end files.

### Real-Time Communication
* **WebSockets (via Socket.IO):** The core technology that enables persistent, bi-directional, and low-latency communication between the clients and the server.

## System Architecture & Design

This project is implemented as a distributed system using a classic client-server architecture. A central Node.js server acts as the communication hub, or "broker," that relays messages between all connected clients.

### Data Flow for a Drawing Event

The real-time synchronization is achieved through a sequence of events:

1.  **User Interaction:** A user draws on the canvas in their browser (Client A).
2.  **Event Emission:** The client's JavaScript captures the drawing coordinates and emits a `drawing` event via Socket.IO.
3.  **Server Receives:** The Node.js server receives the `drawing` event and its data payload.
4.  **Broadcast:** The server immediately broadcasts this `drawing` event to all other connected clients (Client B, Client C, etc.). The `socket.broadcast.emit()` method is used for efficiency, as it prevents sending the data back to the original sender.
5.  **Client Receives:** The other clients receive the incoming `drawing` event.
6.  **Canvas Render:** The JavaScript on the receiving clients executes a function to draw the line on their local canvas based on the data payload, resulting in a synchronized view.

This entire process happens in milliseconds, creating a seamless, real-time experience.

## Local Development Setup

To run this project on your local machine, follow these steps:

### Prerequisites
* Node.js (which includes npm) installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Artham001/CollabSketch.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd CollabSketch
    ```
3.  Install the necessary dependencies:
    ```bash
    npm install
    ```
4.  Start the server:
    ```bash
    npm start
    ```
    (This will likely run `node server.js` as defined in your `package.json`)

5.  Access the application:
    Open your web browser and go to `http://localhost:3000` (or the port specified in your `server.js` file). Open a second browser window or tab to the same address to test the real-time collaboration.

## Future Enhancements (Roadmap)

This project serves as a strong foundation for a full-featured collaborative tool. The next logical steps in its development are:

* **User Authentication:** Implement a system for users to create accounts and log in.
* **Database Integration:** Use a database like MongoDB or PostgreSQL to persist user data, saved whiteboards, and chat history. A potential Entity-Relationship Diagram (ERD) for this is planned out.
* **Private Rooms:** Allow users to create private, shareable rooms with unique URLs so that only invited users can join.
* **Advanced Drawing Tools:** Add support for drawing shapes (lines, rectangles, circles) and adding text to the canvas.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
