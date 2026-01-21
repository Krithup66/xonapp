import axios, {AxiosInstance} from 'axios';

const WHOOP_API_BASE = 'https://api.prod.whoop.com/developer';

export interface WhoopToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface WhoopCycle {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  score_state: string;
  score: {
    strain: number;
    kilojoule: number;
    average_heart_rate: number;
    max_heart_rate: number;
  };
}

export interface WhoopRecovery {
  cycle_id: number;
  sleep_id: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  score_state: string;
  score: {
    user_calibrating: boolean;
    recovery_score: number;
    resting_heart_rate: number;
    hrv_rmssd_milli: number;
    spo2_percentage: number;
    skin_temp_celsius: number;
  };
}

export interface WhoopSleep {
  id: string;
  cycle_id: number;
  v1_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  nap: boolean;
  score_state: string;
  score: {
    stage_summary: {
      total_in_bed_time_milli: number;
      total_awake_time_milli: number;
      total_no_data_time_milli: number;
      total_light_sleep_time_milli: number;
      total_slow_wave_sleep_time_milli: number;
      total_rem_sleep_time_milli: number;
      sleep_cycle_count: number;
      disturbance_count: number;
    };
    sleep_needed: {
      baseline_milli: number;
      need_from_sleep_debt_milli: number;
      need_from_recent_strain_milli: number;
      need_from_recent_nap_milli: number;
    };
    respiratory_rate: number;
    sleep_performance_percentage: number;
    sleep_consistency_percentage: number;
    sleep_efficiency_percentage: number;
  };
}

export interface WhoopWorkout {
  id: string;
  v1_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  sport_name: string;
  sport_id: number;
  score_state: string;
  score: {
    strain: number;
    average_heart_rate: number;
    max_heart_rate: number;
    kilojoule: number;
    percent_recorded: number;
    distance_meter?: number;
    altitude_gain_meter?: number;
    altitude_change_meter?: number;
    zone_durations: {
      zone_zero_milli: number;
      zone_one_milli: number;
      zone_two_milli: number;
      zone_three_milli: number;
      zone_four_milli: number;
      zone_five_milli: number;
    };
  };
}

export interface WhoopUserProfile {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface WhoopBodyMeasurement {
  height_meter: number;
  weight_kilogram: number;
  max_heart_rate: number;
}

class WhoopClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor(accessToken?: string) {
    this.client = axios.create({
      baseURL: WHOOP_API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (accessToken) {
      this.setAccessToken(accessToken);
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Get user profile
  async getUserProfile(): Promise<WhoopUserProfile> {
    const response = await this.client.get('/v2/user/profile/basic');
    return response.data;
  }

  // Get body measurements
  async getBodyMeasurements(): Promise<WhoopBodyMeasurement> {
    const response = await this.client.get('/v2/user/measurement/body');
    return response.data;
  }

  // Get cycles collection
  async getCycles(params?: {
    limit?: number;
    start?: string;
    end?: string;
    nextToken?: string;
  }): Promise<{records: WhoopCycle[]; next_token?: string}> {
    const response = await this.client.get('/v2/cycle', {params});
    return response.data;
  }

  // Get cycle by ID
  async getCycleById(cycleId: number): Promise<WhoopCycle> {
    const response = await this.client.get(`/v2/cycle/${cycleId}`);
    return response.data;
  }

  // Get recovery collection
  async getRecoveries(params?: {
    limit?: number;
    start?: string;
    end?: string;
    nextToken?: string;
  }): Promise<{records: WhoopRecovery[]; next_token?: string}> {
    const response = await this.client.get('/v2/recovery', {params});
    return response.data;
  }

  // Get recovery for cycle
  async getRecoveryForCycle(cycleId: number): Promise<WhoopRecovery> {
    const response = await this.client.get(`/v2/cycle/${cycleId}/recovery`);
    return response.data;
  }

  // Get sleep collection
  async getSleeps(params?: {
    limit?: number;
    start?: string;
    end?: string;
    nextToken?: string;
  }): Promise<{records: WhoopSleep[]; next_token?: string}> {
    const response = await this.client.get('/v2/activity/sleep', {params});
    return response.data;
  }

  // Get sleep by ID
  async getSleepById(sleepId: string): Promise<WhoopSleep> {
    const response = await this.client.get(`/v2/activity/sleep/${sleepId}`);
    return response.data;
  }

  // Get sleep for cycle
  async getSleepForCycle(cycleId: number): Promise<WhoopSleep> {
    const response = await this.client.get(`/v2/cycle/${cycleId}/sleep`);
    return response.data;
  }

  // Get workout collection
  async getWorkouts(params?: {
    limit?: number;
    start?: string;
    end?: string;
    nextToken?: string;
  }): Promise<{records: WhoopWorkout[]; next_token?: string}> {
    const response = await this.client.get('/v2/activity/workout', {params});
    return response.data;
  }

  // Get workout by ID
  async getWorkoutById(workoutId: string): Promise<WhoopWorkout> {
    const response = await this.client.get(`/v2/activity/workout/${workoutId}`);
    return response.data;
  }
}

export default WhoopClient;
