import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalLists: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [agentsRes, listsRes] = await Promise.all([
          axios.get("/api/agents"),
          axios.get("/api/lists"),
        ]);

        setStats({
          totalAgents: agentsRes.data.length,
          totalLists: listsRes.data.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardItems = [
    {
      title: "Manage Agents",
      description: "Create, update, and delete agent accounts",
      link: "/agents",
      icon: "👥",
      count: stats.totalAgents,
    },
    {
      title: "List Management",
      description: "Upload and distribute lists to agents",
      link: "/lists",
      icon: "📋",
      count: stats.totalLists,
    },
  ];

  if (loading) {
    return (
      <Layout>
        <Container className="mt-4">
          <h2>Loading dashboard...</h2>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="mt-4">
        <h2 className="mb-4">Admin Dashboard</h2>
        <Row>
          {dashboardItems.map((item, index) => (
            <Col key={index} md={6} className="mb-4">
              <Link to={item.link} className="text-decoration-none">
                <Card className="h-100 dashboard-card shadow-sm hover-effect">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                      <div className="dashboard-icon me-3">{item.icon}</div>
                      <Card.Title className="mb-0">{item.title}</Card.Title>
                    </div>
                    <Card.Text>{item.description}</Card.Text>
                    <div className="mt-auto pt-3 border-top">
                      <div className="d-flex justify-content-between">
                        <span>Total: {item.count}</span>
                        <span className="text-primary">View &rarr;</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
};

export default Dashboard;
