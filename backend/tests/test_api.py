"""Tests for API health endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.mark.asyncio
async def test_health(client):
    resp = await client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Living Books Hub API"


@pytest.mark.asyncio
async def test_api_root(client):
    resp = await client.get("/api/v1")
    assert resp.status_code == 200
    data = resp.json()
    assert "Living Books Hub" in data["message"]


@pytest.mark.asyncio
async def test_stripe_config(client):
    resp = await client.get("/api/v1/stripe/config")
    assert resp.status_code == 200
    data = resp.json()
    assert "publishable_key" in data
