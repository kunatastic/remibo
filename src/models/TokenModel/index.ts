import { model, Schema } from 'mongoose';

interface Token {
  // email: string;
  discordId: string;
  refresh_token?: string | null;
  expiry_date?: number | null;
  access_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
}

const StringNull = {
  type: String
};

const TokenSchema = new Schema<Token>(
  {
    // email: { ...StringNull, required: true },
    discordId: { ...StringNull, required: true, unique: true },
    refresh_token: StringNull,
    expiry_date: Number,
    access_token: StringNull,
    token_type: StringNull,
    id_token: StringNull
  },
  { timestamps: true }
);

export const TokenModel = model<Token>('Token', TokenSchema);
