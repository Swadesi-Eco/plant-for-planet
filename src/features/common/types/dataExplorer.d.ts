import { Geometry } from '@turf/turf';

export interface IDailyFrame {
  plantedDate: string;
  treesPlanted: number;
}

export interface IWeeklyFrame {
  weekStartDate: string;
  weekEndDate: string;
  weekNum: number;
  month: string;
  year: number;
  treesPlanted: number;
}

export interface IMonthlyFrame {
  month: string;
  year: number;
  treesPlanted: number;
}

export interface IYearlyFrame {
  year: number;
  treesPlanted: number;
}

export interface ISpeciesPlanted {
  other_species: null | string;
  scientific_species_id: number;
  name: null | string;
  total_tree_count: number;
}

export interface IExportData {
  hid: string;
  plant_date: Date;
  species: string;
  tree_count: number;
  geometry: string;
  type: string;
  trees_allocated: number;
  trees_planted: number;
  metadata: string;
  description: null;
  plant_project_id: number;
  sample_tree_count: number;
  capture_status: string;
  created: Date;
}

export interface TotalTreesPlanted {
  totalTreesPlanted: number;
}

export interface TotalSpeciesPlanted {
  totalSpeciesPlanted: number;
}

export interface Site {
  geometry: Geometry;
  properties: {
    name: string;
  };
  type: 'Feature';
}

export type Sites = {
  type: 'FeatureCollection';
  features: Site[];
};

export interface UncleanSite {
  name: string;
  geometry: string;
}

export interface UncleanDistinctSpecies {
  name: string;
}

export type DistinctSpecies = string[];

export enum QueryType {
  DATE = 'date',
  HID = 'hid',
}

export interface UncleanPlantLocations {
  geometry: string;
  guid: string;
}

export interface PlantLocation {
  geometry: Geometry;
  properties: {
    guid: string;
  };
  type: 'Feature';
}

// --- /api/data-explorer/map/plant-location/[plantLocationId]
export interface Measurements {
  width: string;
  height: string;
}

export interface SamplePlantLocation {
  tag: string | null;
  guid: string;
  geometry: Geometry;
  measurements: Measurements;
}

export interface PlantedSpecies {
  treeCount: number;
  scientificName: string;
}

export interface PlantLocationDetailsQueryRes {
  result: string;
}

export interface PlantLocationDetails {
  plantedSpecies: PlantedSpecies[];
  totalPlantedTrees: number;
  samplePlantLocations: SamplePlantLocation[];
  totalSamplePlantLocations: number;
}

// ---
