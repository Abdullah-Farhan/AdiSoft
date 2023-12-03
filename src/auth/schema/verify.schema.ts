import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: true
})

export class Verify {

    @Prop({ unique: [true, 'Account already exists']})
    email: string

    @Prop({default:false})
    verified: boolean
}

export const VerifyUser = SchemaFactory.createForClass(Verify);