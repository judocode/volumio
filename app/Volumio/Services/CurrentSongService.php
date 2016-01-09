<?php

namespace App\Volumio\Services;

use App\Volumio\Utils\ObjectConverterUtil;

class CurrentSongService
{
    protected $db;
    private $properties;

    public function __construct()
    {
        $this->db = app('db');
        $this->properties = array_keys(get_class_vars("App\Volumio\Song"));
    }
    
    public function getCurrentSong()
    {
        $song = [];
        $keyValues = $this->db->select("select * from current_song");
        
        foreach($keyValues as $keyValue)
        {
            $song[$keyValue->k] = $keyValue->v;
        }
        
        return $song;
    }
    
    public function addSongToDb($song)
    {
        if (!is_array($song))
        {
            $song = (array) $song;    
        }
        
        foreach ($this->properties as $property)
        {
            if (array_key_exists($property, $song))
            {
                $parsedValue = str_replace("'", "''", $song[$property]);
                $this->db->update("update current_song set v = '" . $parsedValue . "' where k = '$property'");
            }
        }
    }
}