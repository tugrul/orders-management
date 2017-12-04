<?php


namespace AppBundle\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

use AppBundle\Entity\Product;
use AppBundle\Entity\User;

/**
 * Description of AppFixtures
 *
 * @author tugrul
 */
class AppFixtures extends Fixture
{

    public function load(ObjectManager $manager)
    {
        
        $user = new User();
        $user->setName('John Smith');
        $manager->persist($user);
        
        $user = new User();
        $user->setName('Laura Stone');
        $manager->persist($user);
        
        $user = new User();
        $user->setName('Jon Olsson');
        $manager->persist($user);
        
        $product = new Product();
        $product->setName('Coca Cola');
        $product->setPrice(1.80);
        $manager->persist($product);
        
        $product = new Product();
        $product->setName('Pepsi Cola');
        $product->setPrice(1.60);
        $manager->persist($product);
        
        $manager->flush();
    }


}
