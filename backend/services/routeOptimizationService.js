/**
 * Smart Waste Collection Management System - Route Optimization Service
 * Calculates route efficiency, suggests optimal vehicle assignments, and tracks fuel/carbon savings.
 */
const VehicleModel = require('../models/vehicleModel');

const RouteOptimizationService = {
  /**
   * Suggests the best available vehicle based on proximity, capacity, and current load.
   */
  suggestVehicle: (latitude, longitude, estimatedTonnage = 1.0) => {
    const vehicles = VehicleModel.findAll();
    const candidates = vehicles.filter(v => (
      v.status === 'AVAILABLE' || v.status === 'ON_ROUTE'
    ) && (v.capacity_tons - v.current_load_tons) >= estimatedTonnage);

    if (candidates.length === 0) return null;

    // Rank candidates by distance to target point
    const ranked = candidates.map(veh => {
      const dLat = veh.current_lat - latitude;
      const dLng = veh.current_lng - longitude;
      const distSq = dLat * dLat + dLng * dLng;
      const remainingCapacity = veh.capacity_tons - veh.current_load_tons;
      return {
        vehicle: veh,
        distanceMetric: distSq,
        remainingCapacity
      };
    }).sort((a, b) => a.distanceMetric - b.distanceMetric);

    return ranked[0].vehicle;
  },

  /**
   * Calculates green impact / CO2 savings for electric vs diesel collection fleet.
   */
  calculateSustainabilityMetrics: (totalTonsCollected, distanceKm) => {
    // Approx 2.68 kg CO2 per liter of diesel, approx 0.35 L per km for heavy compactor
    const standardDieselCo2Kg = distanceKm * 0.35 * 2.68;
    const recycledTons = totalTonsCollected * 0.38; // 38% diversion rate
    const co2AvoidedRecycling = recycledTons * 1200; // ~1200 kg CO2 per ton diverted

    return {
      totalCo2EmissionsKg: Math.round(standardDieselCo2Kg),
      co2AvoidedKg: Math.round(co2AvoidedRecycling),
      diversionRatePercentage: 38.0
    };
  }
};

module.exports = RouteOptimizationService;
