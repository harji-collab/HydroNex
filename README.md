# 🌊 HydroNex

### Geospatial Intelligence for Water Resilience

<p align="center">
  <strong>Connecting rainfall variability with satellite-derived surface-water change to identify waterbody vulnerability.</strong>
</p>

<p align="center">
  <a href="https://hydronex-rust.vercel.app/">🌐 Live Demo</a>
  •
  <a href="https://www.youtube.com/watch?v=OISZ8R2aJ5g">🎥 Demo Video</a>
</p>

---

## 📌 Overview

HydroNex is a geospatial intelligence platform designed to analyze how **rainfall variability affects surface-water availability** and identify waterbodies showing potential vulnerability signals.

Instead of treating rainfall and waterbody monitoring as separate datasets, HydroNex connects them through a temporal analysis pipeline.

The platform combines:

- 🛰️ Sentinel-2 satellite imagery
- 🌧️ CHIRPS rainfall data
- 💧 Surface-water extent analysis
- 📈 Rainfall–water response analysis
- ⚠️ Vulnerability indicators
- 🗺️ Interactive geospatial visualization
- 💡 Decision-support insights

The current demonstration focuses on five waterbodies in the Chennai region.

---

## 🎯 Problem Statement

### Rainfall–Surface Water Response Analysis

Rainfall variability does not affect every waterbody in the same way.

HydroNex investigates:

> **How does rainfall variability affect surface-water availability, and which waterbodies are most vulnerable?**

The system analyzes rainfall and surface-water behaviour over time to identify meaningful response and vulnerability signals.

---

## 🚀 Key Features

### 🛰️ Satellite-Based Water Analysis

Uses Sentinel-2 satellite imagery to derive surface-water extent and observe changes over time.

### 🌧️ Rainfall Analysis

Uses CHIRPS rainfall data to analyze rainfall variability and anomalies.

### 📊 Rainfall–Water Response

HydroNex compares rainfall behaviour with changes in surface-water extent to understand how individual waterbodies respond.

### ⚠️ Vulnerability Analysis

The platform combines multiple analytical signals including:

- Rainfall anomaly
- Surface-water area change
- Historical water-area trends
- Rainfall–water response

These are combined into a transparent, project-defined vulnerability indicator.

### 🗺️ Interactive Satellite Map

Explore waterbodies geographically using satellite imagery and interactive map layers.

### 💡 Insights

HydroNex converts analytical signals into concise insights that can support closer monitoring and water-resilience planning.

---

## 🧠 System Workflow

```text
┌─────────────────────┐
│   Sentinel-2 Data   │
│  Satellite Imagery  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Surface Water       │
│ Extent Extraction   │
└──────────┬──────────┘
           │
           │
           ▼
┌─────────────────────┐
│   CHIRPS Rainfall   │
│    Time Series      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Rainfall–Water      │
│ Response Analysis   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Vulnerability       │
│ Indicator           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Interactive Map &   │
│ Decision Insights   │
└─────────────────────┘
