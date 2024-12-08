
import { ActivityEntity } from '../activity/activity.entity';
import { ItineraryEntity } from '../itinerary/itinerary.entity';
import { UserEntity } from '../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ItineraryActivityEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column()
    time: string;

    @ManyToOne(() => ItineraryEntity, itinerary => itinerary.itineraryActivities)
    itinerary: ItineraryEntity;

    @ManyToOne(() => ActivityEntity, activity => activity.itineraryActivities)
    activity: ActivityEntity;

    @ManyToOne(() => UserEntity, user => user.itineraryActivities)
    addedBy: UserEntity;
};

