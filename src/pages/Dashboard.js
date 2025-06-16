import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppNavbar from "../Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

/*   useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios.get("https://your-api-url.com/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setUser(res.data))
    .catch(() => {
      localStorage.clear();
      navigate("/");
    });
  }, [navigate]); */

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <h3>Welcome, {user ? user.name : "User"}!</h3>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
        <Button variant="danger" onClick={() => {
          localStorage.clear();
          navigate("/");
        }}>Logout</Button>
      </Container>
    </>
  );
}
