import axios from "axios";
import { serverApi } from "../lib/config";
import { Provider, ProviderInquiry } from "../lib/data/types/provider";

class ProviderService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getTopProviders(): Promise<Provider[]> {
    try {
      let url = `${this.path}/provider/top-providers`;

      const result = await axios.get(url);
      console.log("getTopProviders: ", result);
      return result.data;
    } catch (err) {
      console.log("error, getTopProviders:", err);

      throw err;
    }
  }

  public async getProviders(input: ProviderInquiry): Promise<Provider[]> {
    try {
      let url = `${this.path}/provider/all?order=${input.order}&page=${input.page}&limit=${input.limit}`;
      if (input.providerCategory)
        url += `&providerCategory=${input.providerCategory}`;
      if (input.isVerified) url += `&isVerified=${input.isVerified}`;
      if (input.search) url += `&search=${input.search}`;

      const result = await axios.get(url);
      console.log("getProviders: ", result);
      return result.data;
    } catch (err) {
      console.log("error, getProviders:", err);

      throw err;
    }
  }

  public async getProvider(providerId: string): Promise<Provider> {
    try {
      const url = `${this.path}/provider/${providerId}`;
      const result = axios.get(url, { withCredentials: true });
      console.log("getProvider", result);
      return (await result).data;
    } catch (err) {
      console.log("error, getProvider:", err);

      throw err;
    }
  }
}

export default ProviderService;
