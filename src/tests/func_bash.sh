#!/bin/bash

function func1 {
    ls /teste
}

function func2 {
    echo 'func2'
}


{
    func1 && func2
} || {
    echo 'error execute func'
}