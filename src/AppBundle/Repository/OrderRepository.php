<?php

namespace AppBundle\Repository;

use AppBundle\Entity\User;
use AppBundle\Entity\Product;

use AppBundle\Exception\OrderException;

/**
 * OrderRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class OrderRepository extends \Doctrine\ORM\EntityRepository
{
    
    public function findAllBySearch($term = null, $range = null)
    {
        $builder = $this->createQueryBuilder('o');
        
        if (!empty($range)) {

            switch ($range) {
                case 1: break;
                case 2: $dateStart = new \DateTime(); $dateStart->modify('-7 days'); break;
                case 3: $dateStart = new \DateTime(); $dateStart->setTime(0, 0, 0); break;
                default: throw new OrderException('Invalid range id');
            }
        
            if (!empty($dateStart)) {
                $builder->where('o.date >= :dateStart')->setParameter('dateStart', $dateStart);
            }
        }

        if (!empty($term)) {
            $em = $this->getEntityManager();

            $userQuery = $em->createQueryBuilder();
            $userQuery->select('u.id')
                    ->from(User::class, 'u')
                    ->where($userQuery->expr()->like('u.name', ':term'));

            $productQuery = $em->createQueryBuilder();
            $productQuery->select('p.id')
                    ->from(Product::class, 'p')
                    ->where($userQuery->expr()->like('p.name', ':term'));
            
            $builder->andWhere($builder->expr()->orX(
                    $builder->expr()->in('o.user', $userQuery->getDQL()),
                    $builder->expr()->in('o.product', $productQuery->getDQL())
                    ));

            $builder->setParameter('term', '%' . $term . '%');
        }
        
        return $builder->getQuery()->execute();
    }
    
}
