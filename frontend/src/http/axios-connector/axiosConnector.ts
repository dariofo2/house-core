import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import default CSS for react-toastify

import { UserOutputDTO } from "../DTO/UserOutputDTO";
import { RoleOutputDTO } from "../DTO/RoleOutputDTO";
import { CreateUserDTO } from "../DTO/CreateUserDTO";
import { UpdateUserDTO } from "../DTO/UpdateUserDTO";
import { UpdateUserPasswordDTO } from "../DTO/UpdateUserPasswordDTO";
import { LoginDTO } from "../DTO/LoginDTO";
import { HouseOutputDTO } from "../DTO/HouseOutputDTO";
import { CreateHouseDTO } from "../DTO/CreateHouseDTO";
import { UpdateHouseDTO } from "../DTO/UpdateHouseDTO";
import { UserHouseOutputDTO } from "../DTO/UserHouseOutputDTO";
import { AddUserHouseDTO } from "../DTO/AddUserHouseDTO";
import { UpdateUserHouseDTO } from "../DTO/UpdateUserHouseDTO";
import { ProductBatchOutputDTO } from "../DTO/ProductBatchOutputDTO";
import { ProductOutputDTO } from "../DTO/ProductOutputDTO";
import { SubcategoryOutputDTO } from "../DTO/SubcategoryOutputDTO";
import { CategoryOutputDTO } from "../DTO/CategoryOutputDTO";
import { CreateCategoryDTO } from "../DTO/CreateCategoryDTO";
import { UpdateCategoryDTO } from "../DTO/UpdateCategoryDTO";
import { CreateSubcategoryDTO } from "../DTO/CreateSubcategoryDTO";
import { UpdateSubcategoryDTO } from "../DTO/UpdateSubcategoryDTO";
import { CreateProductDTO } from "../DTO/CreateProductDTO";
import { UpdateProductDTO } from "../DTO/UpdateProductDTO";
import { CreateProductBatchDTO } from "../DTO/CreateProductBatchDTO";
import { UpdateProductBatchDTO } from "../DTO/UpdateProductBatchDTO";
import { EventOutputDTO } from "../DTO/EventOutputDTO";
import { CreateEventDTO } from "../DTO/CreateEventDTO";
import { UpdateEventDTO } from "../DTO/UpdateEventDTO";
import { CookRecipeProductOutputDTO } from "../DTO/CookRecipeProductOutputDTO";
import { CookRecipeOutputDTO } from "../DTO/CookRecipeOutputDTO";
import { CreateCookRecipeDTO } from "../DTO/CreateCookRecipeDTO";
import { UpdateCookRecipeDTO } from "../DTO/UpdateCookRecipeDTO";
import { CreateCookRecipeProductDTO } from "../DTO/CreateCookRecipeProductDTO";
import { UpdateCookRecipeProductDTO } from "../DTO/UpdateCookRecipeProductDTO";

// Define a generic error structure that matches typical API error responses
interface ApiError {
  statusCode: number;
  message: string;
  error?: string; // NestJS often includes an 'error' field
}

// Configure your API base URL here
// You can also use environment variables, e.g., process.env.API_URL
//const BASE_URL = "http://localhost:3000"; // Replace with your actual API base URL

class ApiService {
  private static readonly apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  /**
   * Generic handler for API errors.
   * It checks for specific status codes like 401 and provides toast notifications for others.
   * @param error The Axios error object.
   */
  private static handleApiError(error: AxiosError): void {
    if (error.response) {
      const statusCode = error.response.status;
      const apiError = error.response.data as ApiError | undefined;

      if (statusCode === 401) {
        toast.error(
          "Unauthorized access. Please check your credentials or token.",
        );
        this.logout().finally(() => {
          window.location.href = "/";
        });
        // Placeholder for 401 specific handling:
        // This is where you might redirect the user to a login page,
        // trigger a token refresh, or show a specific message.
        // Example: window.location.href = '/login';
      } else if (apiError && apiError.message) {
        toast.error(`API Error ${statusCode}: ${apiError.message}`);
      } else {
        toast.error(
          `Request failed with status ${statusCode}: ${error.message}`,
        );
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("API Error: No response received from server.");
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error(
        "API Error: An unexpected error occurred setting up the request." +
          error.message,
      );
    }
  }

  // Interceptor for handling responses globally
  static {
    ApiService.apiClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        ApiService.handleApiError(error);
        return Promise.reject(error);
      },
    );
  }

  // --- API Functions ---

  /**
   * Get Hello message.
   * GET /
   */
  static async getHello(): Promise<string> {
    try {
      const response = await ApiService.apiClient.get("/");
      return response.data;
    } catch (error) {
      throw error; // Re-throw to allow caller to handle
    }
  }

  /**
   * Get an User by ID.
   * GET /user/get/{id}
   */
  static async getUserById(id: number): Promise<UserOutputDTO> {
    try {
      const response = await ApiService.apiClient.get(`/user/get/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get Roles of a User by User ID.
   * GET /user/getUserRoles/{id}
   */
  static async getUserRoles(id: number): Promise<Array<RoleOutputDTO>> {
    try {
      const response = await ApiService.apiClient.get(
        `/user/getUserRoles/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get List of Users (Only can be User as role.ADMIN).
   * GET /user/list
   */
  static async listUsers(): Promise<Array<UserOutputDTO>> {
    try {
      const response = await ApiService.apiClient.get("/user/list");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create an User (Can be used Anonymous).
   * POST /user/create
   */
  static async createUser(userData: CreateUserDTO): Promise<boolean> {
    try {
      const response = await ApiService.apiClient.post(
        "/user/create",
        userData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create user (Only as Admin).
   * POST /user/createAdmin
   */
  static async createUserAdmin(
    userData: CreateUserDTO,
  ): Promise<UserOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        "/user/createAdmin",
        userData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an User. Updates itself, and Admin can update Everyone.
   * PATCH /user/update
   */
  static async updateUser(userData: UpdateUserDTO): Promise<UserOutputDTO> {
    try {
      const response = await ApiService.apiClient.patch(
        "/user/update",
        userData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update password of Itself, or Admin can update Everyone without lastPassword Check.
   * PATCH /user/updatePassword
   */
  static async updateUserPassword(
    passwordData: UpdateUserPasswordDTO,
  ): Promise<UserOutputDTO> {
    try {
      const response = await ApiService.apiClient.patch(
        "/user/updatePassword",
        passwordData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete an User. Deletes itself but Admin can delete Everyone.
   * DELETE /user/delete/{id}
   */
  static async deleteUser(id: number): Promise<UserOutputDTO> {
    try {
      const response = await ApiService.apiClient.delete(`/user/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add a Role to an User (Only admin).
   * POST /user/addUserRole/{userId}/{roleName}
   */
  static async addUserRole(
    userId: number,
    roleName: string,
  ): Promise<RoleOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        `/user/addUserRole/${userId}/${roleName}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a role From User (Only as Admin).
   * DELETE /user/deleteUserRole/{userId}/{roleName}
   */
  static async deleteUserRole(
    userId: number,
    roleName: string,
  ): Promise<RoleOutputDTO> {
    try {
      const response = await ApiService.apiClient.delete(
        `/user/deleteUserRole/${userId}/${roleName}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * User login.
   * POST /auth/login
   */
  static async login(credentials: LoginDTO): Promise<UserOutputDTO> {
    // Assuming login returns some token or user info, adjust return type as needed
    try {
      const response = await ApiService.apiClient.post(
        "/auth/login",
        credentials,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * User logout.
   * POST /auth/logout
   */
  static async logout(): Promise<boolean> {
    try {
      const response = await ApiService.apiClient.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a House by ID.
   * GET /house/get/{id}
   */
  static async getHouseById(id: number): Promise<HouseOutputDTO> {
    try {
      const response = await ApiService.apiClient.get(`/house/get/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * List Houses.
   * GET /house/list
   */
  static async listHouses(): Promise<Array<HouseOutputDTO>> {
    try {
      const response = await ApiService.apiClient.get("/house/list");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * List ALL Houses (ONLY ADMIN USER).
   * GET /house/listAll
   */
  static async listAllHouses(): Promise<Array<HouseOutputDTO>> {
    try {
      const response = await ApiService.apiClient.get("/house/listAll");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a House.
   * POST /house/create
   */
  static async createHouse(houseData: CreateHouseDTO): Promise<HouseOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        "/house/create",
        houseData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a House.
   * PUT /house/update
   */
  static async updateHouse(houseData: UpdateHouseDTO): Promise<HouseOutputDTO> {
    try {
      const response = await ApiService.apiClient.put(
        "/house/update",
        houseData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a House.
   * DELETE /house/delete/{id}
   */
  static async deleteHouse(id: number): Promise<string> {
    try {
      const response = await ApiService.apiClient.delete(`/house/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get Users associated with a House.
   * GET /house/listUsersHouse/{houseId}
   */
  static async getUsersHouse(houseId: number): Promise<Array<UserHouseOutputDTO>> {
    try {
      const response = await ApiService.apiClient.get(
        `/house/listUsersHouse/${houseId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add User to a House.
   * POST /house/addUserHouse
   */
  static async addUserHouse(
    addUserHouseData: AddUserHouseDTO,
  ): Promise<UserHouseOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        "/house/addUserHouse",
        addUserHouseData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a user from a House.
   * DELETE /house/deleteUserHouse/{userId}/{houseId}
   */
  static async deleteUserHouse(
    userId: number,
    houseId: number,
  ): Promise<UserHouseOutputDTO> {
    try {
      const response = await ApiService.apiClient.delete(
        `/house/deleteUserHouse/${userId}/${houseId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update User's role in a House.
   * PUT /house/updateUserHouse
   */
  static async updateUserHouse(
    updateUserHouseData: UpdateUserHouseDTO,
  ): Promise<UserHouseOutputDTO> {
    try {
      const response = await ApiService.apiClient.put(
        "/house/updateUserHouse",
        updateUserHouseData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get Categories with Subcategories and Products Join ALL for a House.
   * GET /category/getByHouseJoinProduct/{houseId}
   */
  static async getCategoryJoinProduct(
    houseId: number,
  ): Promise<CategoryOutputDTO> {
    try {
      const response = await ApiService.apiClient.get(
        `/category/getByHouseJoinProduct/${houseId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a Category.
   * POST /category/create
   */
  static async createCategory(
    categoryData: CreateCategoryDTO,
  ): Promise<CategoryOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        "/category/create",
        categoryData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a Category.
   * PUT /category/update
   */
  static async updateCategory(
    categoryData: UpdateCategoryDTO,
  ): Promise<CategoryOutputDTO> {
    try {
      const response = await ApiService.apiClient.put(
        "/category/update",
        categoryData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a Category.
   * DELETE /category/delete/{id}
   */
  static async deleteCategory(id: number): Promise<CategoryOutputDTO> {
    try {
      const response = await ApiService.apiClient.delete(
        `/category/delete/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a Subcategory.
   * POST /subcategory/create
   */
  static async createSubcategory(
    subcategoryData: CreateSubcategoryDTO,
  ): Promise<SubcategoryOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        "/subcategory/create",
        subcategoryData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a Subcategory.
   * PUT /subcategory/update
   */
  static async updateSubcategory(
    subcategoryData: UpdateSubcategoryDTO,
  ): Promise<SubcategoryOutputDTO> {
    try {
      const response = await ApiService.apiClient.put(
        "/subcategory/update",
        subcategoryData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a Subcategory.
   * DELETE /subcategory/delete/{id}
   */
  static async deleteSubcategory(id: number): Promise<SubcategoryOutputDTO> {
    try {
      const response = await ApiService.apiClient.delete(
        `/subcategory/delete/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create Product.
   * POST /product/create
   */
  static async createProduct(
    productData: CreateProductDTO,
  ): Promise<ProductOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        "/product/create",
        productData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update Product.
   * PUT /product/update
   */
  static async updateProduct(
    productData: UpdateProductDTO,
  ): Promise<ProductOutputDTO> {
    try {
      const response = await ApiService.apiClient.put(
        "/product/update",
        productData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete Product.
   * DELETE /product/delete/{id}
   */
  static async deleteProduct(id: number): Promise<ProductOutputDTO> {
    try {
      const response = await ApiService.apiClient.delete(
        `/product/delete/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create Product Batch.
   * POST /product/createBatch
   */
  static async createProductBatch(
    productBatchData: CreateProductBatchDTO,
  ): Promise<ProductBatchOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        "/product/createBatch",
        productBatchData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update Product Batch.
   * PUT /product/updateBatch
   */
  static async updateProductBatch(
    productBatchData: UpdateProductBatchDTO,
  ): Promise<ProductBatchOutputDTO> {
    try {
      const response = await ApiService.apiClient.put(
        "/product/updateBatch",
        productBatchData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Increment a Product Batch by Product Step.
   * POST /product/incrementBatch/{id}
   */
  static async incrementProductBatch(
    id: number,
  ): Promise<ProductBatchOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        `/product/incrementBatch/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Decrement a Product Batch by Product Step.
   * POST /product/decrementBatch/{id}
   */
  static async decrementProductBatch(
    id: number,
  ): Promise<ProductBatchOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        `/product/decrementBatch/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get Events by House ID.
   * GET /event/getByHouse/{houseId}
   */
  static async getEventByHouseId(
    houseId: number,
  ): Promise<Array<EventOutputDTO>> {
    try {
      const response = await ApiService.apiClient.get(
        `/event/getByHouse/${houseId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create Event in House.
   * POST /event/create
   */
  static async createEvent(eventData: CreateEventDTO): Promise<EventOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        "/event/create",
        eventData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update Event in House.
   * PUT /event/update
   */
  static async updateEvent(eventData: UpdateEventDTO): Promise<EventOutputDTO> {
    try {
      const response = await ApiService.apiClient.put(
        "/event/update",
        eventData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete Event in House.
   * DELETE /event/delete/{id}
   */
  static async deleteEvent(id: number): Promise<EventOutputDTO> {
    try {
      const response = await ApiService.apiClient.delete(`/event/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset Timer Event in House.
   * POST /event/reset/{id}
   */
  static async resetEvent(id: number): Promise<EventOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(`/event/reset/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * List Join CookRecipes By House.
   * GET /cookRecipe/listJoinByHouse/{houseId}
   */
  static async listJoinByHouse(houseId: number): Promise<CookRecipeOutputDTO> {
    try {
      const response = await ApiService.apiClient.get(
        `/cookRecipe/listJoinByHouse/${houseId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create Cook Recipe.
   * POST /cookRecipe/create
   */
  static async createCookRecipe(
    cookRecipeData: CreateCookRecipeDTO,
  ): Promise<CookRecipeOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        "/cookRecipe/create",
        cookRecipeData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update Cook Recipe.
   * PUT /cookRecipe/update
   */
  static async updateCookRecipe(
    cookRecipeData: UpdateCookRecipeDTO,
  ): Promise<CookRecipeOutputDTO> {
    try {
      const response = await ApiService.apiClient.put(
        "/cookRecipe/update",
        cookRecipeData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete Cook Recipe.
   * DELETE /cookRecipe/delete/{id}
   */
  static async deleteCookRecipe(id: number): Promise<CookRecipeOutputDTO> {
    try {
      const response = await ApiService.apiClient.delete(
        `/cookRecipe/delete/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create Cook Recipe Product Relation.
   * POST /cookRecipe/createCookRecipeProduct
   */
  static async createCookRecipeProduct(
    cookRecipeProductData: CreateCookRecipeProductDTO,
  ): Promise<CookRecipeProductOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        "/cookRecipe/createCookRecipeProduct",
        cookRecipeProductData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update Cook Recipe Product Relation.
   * PUT /cookRecipe/updateCookRecipeProduct
   */
  static async updateCookRecipeProduct(
    cookRecipeProductData: UpdateCookRecipeProductDTO,
  ): Promise<CookRecipeProductOutputDTO> {
    try {
      const response = await ApiService.apiClient.put(
        "/cookRecipe/updateCookRecipeProduct",
        cookRecipeProductData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete Cook Recipe Product Relation.
   * DELETE /cookRecipe/deleteCookRecipeProduct/{cookRecipeId}/{productId}
   */
  static async deleteCookRecipeProduct(
    cookRecipeId: number,
    productId: number,
  ): Promise<CookRecipeProductOutputDTO> {
    try {
      const response = await ApiService.apiClient.delete(
        `/cookRecipe/deleteCookRecipeProduct/${cookRecipeId}/${productId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make a Recipe decreasing Product Batches.
   * POST /cookRecipe/makeCookRecipe/{id}
   */
  static async makeCookRecipe(id: number): Promise<CookRecipeOutputDTO> {
    try {
      const response = await ApiService.apiClient.post(
        `/cookRecipe/makeCookRecipe/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ApiService;
