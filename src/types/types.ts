export type MissionStatus = "planned" | "in-progress" | "completed" | "failed";
export type PlanetType = "rocky" | "gas-giant" | "ice-giant" | "dwarf";
export type CrewRole = "commander" | "pilot" | "engineer" | "scientist" | "medic";

export interface Planet {
  id: string;
  name: string;
  type: PlanetType;
  description: string;
  distanceFromSun: number;
  diameter: number;
  gravity: number;
  temperature: number;
  image: string;
  color: string;
}

export interface ExplorableData {
  missionsCount: number;
  lastExplored: string;
  explorationStatus: MissionStatus;
  dangerLevel: number;
}

export type ExplorablePlanet = Planet & ExplorableData;

export interface Mission {
  id: string;
  name: string;
  destination: string;
  status: MissionStatus;
  crewSize: number;
  startDate: string;
  endDate: string | null;
}

export interface MissionApplicationData {
  fullName: string;
  email: string;
  callsign: string;
  role: CrewRole;

  preferredDestination: string;
  experienceLevel: number;
  motivation: string;
  availabilityDate: string;

  termsAccepted: boolean;
  recaptchaToken: string;
}

export interface MissionChartData {
  month: string;
  missions: number;
  discoveries: number;
}

export type PartialApplication = Partial<MissionApplicationData>;
export type PlanetSummary = Pick<Planet, "id" | "name" | "type" | "image" | "color">;
export type MissionRecord = Record<string, Mission[]>;
export type PlanetWithoutImage = Omit<Planet, "image">;
export type RequiredApplication = Required<MissionApplicationData>;

export function isExplorablePlanet(
  planet: Planet | ExplorablePlanet
): planet is ExplorablePlanet {
  return (
    "missionsCount" in planet &&
    "explorationStatus" in planet &&
    "dangerLevel" in planet
  );
}

export function formatCelestialData(value: number, unit: "distance"): string;
export function formatCelestialData(value: number, unit: "temperature"): string;
export function formatCelestialData(value: number, unit: "gravity"): string;
export function formatCelestialData(value: number, unit: string): string {
  switch (unit) {
    case "distance":
      return `${value.toLocaleString()} mln km`;
    case "temperature":
      return `${value > 0 ? "+" : ""}${value}°C`;
    case "gravity":
      return `${value.toFixed(2)}g`;
    default:
      return `${value}`;
  }
}
