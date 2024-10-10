import { Document, model, models, Schema } from "mongoose";

interface ICategory extends Document {
  _id: string;
  name: string;
}

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Category = models.category || model("Category", CategorySchema);

export default Category;
