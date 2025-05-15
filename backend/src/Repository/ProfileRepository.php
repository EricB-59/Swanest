<?php

namespace App\Repository;

use App\Entity\Profile;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Profile>
 */
class ProfileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Profile::class);
    }

    /**
     * @return Profile[]
     */
    public function findProfiles(
        int $userID, 
        ?int $minAge = null, 
        ?int $maxAge = null, 
        ?string $gender = null, 
        ?string $province = null
    )
    {
        $qb = $this->createQueryBuilder('p')
                ->where('p.user != :user_id')
                ->setParameter('user_id', $userID)
                ->andWhere('p.user NOT IN (
                    SELECT IDENTITY(l.liked) FROM App\Entity\Like l WHERE l.liker = :user_id
                )')
                ->andWhere('p.user NOT IN (
                    SELECT IDENTITY(d.disliked) FROM App\Entity\Dislike d WHERE d.disliker = :user_id
                )');
                
        if($minAge !== null && $maxAge !== null){
            $today = new DateTime();
            $currentDate = $today->format('Y-m-d');

            $qb->andWhere("TIMESTAMPDIFF(YEAR, p.birthdate, :currentDate) >= :minAge")
                ->andWhere("TIMESTAMPDIFF(YEAR, p.birthdate, :currentDate) <= :maxAge")
                ->setParameter("currentDate", $currentDate)
                ->setParameter("minAge", $minAge)
                ->setParameter("maxAge", $maxAge);
            // dd("bien");
        }
        if($gender !== null){
            $qb->innerJoin('p.gender', 'g')
                ->andWhere('g.name = :gender')
                ->setParameter('gender', $gender);
        }
        if ($province !== null){
            $qb->innerJoin('p.province', 'pr')
                ->andWhere('pr.name = :province')
                ->setParameter('province', $province);
        }
        $qb->orderBy('RAND()');
 
        return $qb->getQuery()->getResult();
    }
    //    /**
    //     * @return Profile[] Returns an array of Profile objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Profile
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}