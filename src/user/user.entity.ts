
import { ItineraryActivityEntity } from '../itinerary-activity/itinerary-activity.entity';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;
    
    @Column()
    email: string;

    @Column()
    phone: string;
    
    @Column()
    profilePic: string;

    @Column()
    password: string;

    @ManyToMany(() => ItineraryEntity, itinerary => itinerary.users)
    @JoinTable()
    itineraries: ItineraryEntity[];

    @OneToMany(() => ItineraryActivityEntity, itineraryActivity => itineraryActivity.addedBy)
    itineraryActivities: ItineraryActivityEntity[];
}