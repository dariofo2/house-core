import { Test, TestingModule } from '@nestjs/testing';
import CookRecipeService from './cook-recipe.service';
import CookRecipRepository from './cook-recipe.repository';
import ProductRepository from 'src/product/repositories/product.repository';
import HouseService from 'src/house/house.service';
import { BadRequestException } from '@nestjs/common';
import User from 'src/database/entities/user/user.entity';
import CookRecipe from 'src/database/entities/cook-recipe/cook-recipe.entity';
import Product from 'src/database/entities/product/product.entity';

describe('CookRecipeService', () => {
  let service: CookRecipeService;
  let cookRecipeRepository: CookRecipRepository;
  let productRepository: ProductRepository;
  let houseService: HouseService;

  const mockUser = { id: 1 } as User;
  const mockCookRecipe = { id: 1, houseId: 1, name: 'Recipe' } as CookRecipe;
  const mockProduct = { id: 1, houseId: 1, name: 'Product' } as Product;

  const mockCookRecipeRepository = {
    listCookRecipesJoinProductByHouseId: jest.fn(),
    createCookRecipe: jest.fn(),
    getCookRecipe: jest.fn(),
    updateCookRecipe: jest.fn(),
    deleteCookRecipe: jest.fn(),
    createCookRecipeProduct: jest.fn(),
    getCookRecipeProduct: jest.fn(),
    updateCookRecipeProduct: jest.fn(),
    deleteCookRecipeProduct: jest.fn(),
    getCookRecipeJoinProduct: jest.fn(),
  };

  const mockProductRepository = {
    getProduct: jest.fn(),
  };

  const mockHouseService = {
    checkIfUserisOnHouse: jest.fn(),
    checkIfUserisOnHouseAndUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CookRecipeService,
        { provide: CookRecipRepository, useValue: mockCookRecipeRepository },
        { provide: ProductRepository, useValue: mockProductRepository },
        { provide: HouseService, useValue: mockHouseService },
      ],
    }).compile();

    service = module.get<CookRecipeService>(CookRecipeService);
    cookRecipeRepository = module.get<CookRecipRepository>(CookRecipRepository);
    productRepository = module.get<ProductRepository>(ProductRepository);
    houseService = module.get<HouseService>(HouseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('makeCookRecipe', () => {
    it('should decrease product quantities in batches', async () => {
      const fullRecipe = {
        ...mockCookRecipe,
        cookRecipeProducts: [
          {
            quantity: 10,
            product: {
              id: 1,
              productBatches: [
                { id: 1, quantity: 6 },
                { id: 2, quantity: 10 },
              ],
            },
          },
        ],
      };

      mockCookRecipeRepository.getCookRecipeJoinProduct.mockResolvedValue(fullRecipe);
      mockHouseService.checkIfUserisOnHouseAndUser.mockResolvedValue(undefined);
      mockCookRecipeRepository.updateCookRecipe.mockImplementation((recipe) => recipe);

      const result = await service.makeCookRecipe(mockUser, 1);

      expect(result).toBeDefined();
      // Batch 1: 6 - 10 = -4 -> set to 0. quantityToDelete becomes 4.
      // Batch 2: 10 - 4 = 6.
      expect(fullRecipe.cookRecipeProducts[0].product.productBatches[0].quantity).toBe(0);
      expect(fullRecipe.cookRecipeProducts[0].product.productBatches[1].quantity).toBe(6);
      expect(mockCookRecipeRepository.updateCookRecipe).toHaveBeenCalledWith(fullRecipe);
    });

    it('should throw BadRequestException if recipe not found', async () => {
      mockCookRecipeRepository.getCookRecipeJoinProduct.mockResolvedValue(null);
      await expect(service.makeCookRecipe(mockUser, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getHouseIdFromProductCookRecipe', () => {
    it('should return houseId if product and recipe belong to the same house', async () => {
      mockProductRepository.getProduct.mockResolvedValue(mockProduct);
      mockCookRecipeRepository.getCookRecipe.mockResolvedValue(mockCookRecipe);

      const result = await service.getHouseIdFromProductCookRecipe(1, 1);
      expect(result).toBe(1);
    });

    it('should throw BadRequestException if houses do not match', async () => {
      mockProductRepository.getProduct.mockResolvedValue({ ...mockProduct, houseId: 1 });
      mockCookRecipeRepository.getCookRecipe.mockResolvedValue({ ...mockCookRecipe, houseId: 2 });

      await expect(service.getHouseIdFromProductCookRecipe(1, 1)).rejects.toThrow(
        'Houses dont match on Product and CookRecipe',
      );
    });
  });
});
