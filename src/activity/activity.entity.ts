

import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AdminEntity } from '../admin/admin.entity';
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';

@Entity()
export class ActivityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    durationMins: number;

    @Column()
    name: string;

    @Column("simple-array")
    addressess: string[];

    @ManyToOne(() => AdminEntity, admin => admin.activities)
    admin: AdminEntity;

    @OneToMany(() => ItineraryActivityEntity, itineraryActivity => itineraryActivity.activity)
    itineraryActivities: ItineraryActivityEntity[];
}