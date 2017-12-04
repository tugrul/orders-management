<?php

namespace AppBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class OrderControllerTest extends WebTestCase
{
    public function testSearchorder()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/order/search');
    }

    public function testCreateorder()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/order/create');
    }

    public function testDeleteorder()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/order/delete');
    }

    public function testEditorder()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/order/edit');
    }

}
