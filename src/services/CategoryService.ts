import Category from "../models/Category";
import { getRepository } from "typeorm";

class CategoryService {
    public async GetOrCreateAsync(title: string): Promise<Category> {
        const repository = getRepository(Category);
        let category = await repository.findOne({
            where: { title }
        });

        if (!category) {
            const createCategory = repository.create({ title });
            await repository.save(createCategory);
            category = createCategory;
        }

        return category;
    }
}

export default CategoryService;