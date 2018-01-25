#!/usr/bin/env python
import logger


def find_thing(id, r):
    if id[1] == '1':
        logger.log('Finding comment: ' + id[3:])
        return r.comment(id=id[3:])
    elif id[1] == '3':
        logger.log('Finding submission: ' + id[3:])
        return r.submission(id=id[3:])
    else:
        raise Exception("Id not found")
