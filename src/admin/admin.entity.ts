import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityEntity } from '../activity/activity.entity';

@Entity()
export class AdminEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   name: string;

   @Column({ unique: true })
   email: string;

   @Column()
   phone: string;

   @Column()
   profilePic: string;

   @OneToMany(() => ActivityEntity, activity => activity.admin)
   activities: ActivityEntity[];
}
