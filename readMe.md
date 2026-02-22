# 🛰️ Middlemen: Visual HTTP Tunneling Proxy

**Middlemen** is a high-performance, event-driven HTTP tunneling proxy built with **Node.js**. It demonstrates the mechanics of the `HTTP CONNECT` method, allowing for protocol-agnostic data transmission (tunneling) between a client and a remote server. 

This project features a **Real-Time Visual Dashboard** that monitors data packets, connection statuses, and transfer speeds using **Socket.io**.



## 🚀 Key Features
* **Full TCP Tunneling**: Seamlessly handles both standard HTTP and encrypted HTTPS (SSL/TLS) traffic.
* **Live Monitoring Dashboard**: A web-based UI to visualize data flowing through the proxy in real-time.
* **Progress Tracking**: Includes a dynamic progress bar and a "Total Data Processed" counter for large transfers.
* **Robust Error Handling**: Specifically designed to handle `ECONNRESET` and connection drops without crashing the server.
* **Streaming Efficiency**: Utilizes Node.js `Stream.pipe()` to ensure zero-buffering and low memory usage, even during multi-gigabyte transfers.

## 🛠️ Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/WebAppDev-Abhishek/Middlemen.git](https://github.com/WebAppDev-Abhishek/Middlemen.git)
    cd Middlemen
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Application**:
    ```bash
    node server.js
    ```

4.  **Open the Dashboard**:
    Navigate to `http://localhost:3000` in your web browser.

---

## 🧪 Testing the Proxy

To demonstrate the "Middleman" in action, open a second terminal and run these commands:

<img width="705" height="594" alt="Screenshot 2026-02-22 140356" src="https://github.com/user-attachments/assets/064c63f0-f00f-4c80-8378-614aca9bca78" />


### 1. Large File Transfer (Stress Test)
This will trigger the progress bar and show the "Total MB" counter climbing.
```bash
curl -p -x 127.0.0.1:1337 [http://ipv4.download.thinkbroadband.com/10MB.zip](http://ipv4.download.thinkbroadband.com/10MB.zip) -o test.zip
