import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  gender: string;

  @Prop({
    type: Number,
    required: true,
    index: true,
  })
  age: number;
}

export const userSchema = SchemaFactory.createForClass(User);
