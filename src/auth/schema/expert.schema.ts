import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: true
})

export class Expert {

    @Prop({required:true, type:String})
    name: string

    @Prop({ unique: [true, 'Account already exists']})
    email: string

    @Prop({required:true, type:String})
    password: string

    @Prop({required:true, type:String})
    phno: string

    @Prop({required:true, type:String})
    linkedIn: string

    @Prop({default:'Null', required:true, type:String})
    domain: string

    @Prop({required:true, type:String})
    type: string


    @Prop({default:false, required:true, type:String})
    verified: boolean
}

export const ExpertSchema = SchemaFactory.createForClass(Expert);