import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: true
})

export class PasswordReset {

    @Prop({ unique: [true, 'Account already exists']})
    email: string

    @Prop({default:false})
    otp: string
}

export const PasswordSchema = SchemaFactory.createForClass(PasswordReset);