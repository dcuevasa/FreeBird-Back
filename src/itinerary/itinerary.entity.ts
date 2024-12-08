
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { UserEntity } from '../user/user.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ItineraryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;
    
    @Column()
    budget: number;

    @Column()
    destination: string;
    
    @Column()
    startDate: Date;
    
    @Column()
    endDate: Date;
    
    @Column('simple-array')
    preferences: string[];

    @Column()
    transport: string;

    @ManyToMany(() => UserEntity, user => user.itineraries, {eager: true})
    users: UserEntity[];

    @OneToMany(() => ItineraryActivityEntity, itineraryActivity => itineraryActivity.itinerary)
    itineraryActivities: ItineraryActivityEntity[];
}