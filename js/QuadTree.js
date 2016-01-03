function QuadTree(pLevel, pBounds) {
    var MAX_OBJECTS = 10;
    var MAX_LEVELS = 5;
    
    var level = pLevel;
    var objects = [];
    var bounds = pBounds;
    var nodes = [4];
    
    /*
     * Clears the quadtree
     */
    this.clear = function() {
        this.objects.clear();
        
        for(var i = 0; i < nodes.length; i++) {
            if(nodes[i] != null) {
                nodes[i].clear();
                nodes[i] = null;
            }
        }
    }
    
    this.split = function() {
        var subWidth = bounds.getWidth() / 2;
        var subHeight = bounds.getHeight() / 2;
        var x = bounds.getX();
        var y = bounds.getY();
        
        nodes[0] = new QuadTree(level+1, new Rectangle(x + subWidth, y, subWidth, subHeight));
        nodes[1] = new QuadTree(level+1, new Rectangle(x, y, subWidth, subHeight));
        nodes[2] = new QuadTree(level+1, new Rectangle(x, y + subHeight, subWidth, subHeight));
        nodes[3] = new QuadTree(level+1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));
    }
    
    this.getIndex = function(pRect) {
        var index = -1;
        var verticalMidpoint = bounds.getX() + (bounds.getWidth / 2);
        var horizontalMidpoint = bounds.getY() + (bounds.getHeight / 2);
        
        var topQuadrant = (pRect.getY() < horizontalMidpoint && pRect.getY() + pRect.getHeight() < horizontalMidpoint);
        
        var bottomQuadrant = (pRect.getY() > horizontalMidpoint);
        
        if(pRect.getX() < vertialMidpoint && pRect.getX() + pRect.getWidth() < verticalMidpoint) {
            if(topQuadrant) {
                index = 1;
            } else if(bottomQuadrant) {
                index = 2;
            }
        } else if(pRect.getX() > vertialMidpoint) {
            if(topQuadrant) {
                index = 0;
            } else if(bottomQuadrant) {
                index = 3;
            }
        }
        
        return index;
    }
    
    this.insert = function(pRect) {
        if(nodes[0] != null) {
            var index = this.getIndex(pRect);
            
            if(index != -1) {
                nodes[index].insert(pRect);
                
                return;
            }
        }
        
        objects.add(pRect);
        
        if(objects.size() > MAX_OBJECTS && level < MAX_LEVELS) {
            if(nodes[0] == null) {
                this.split();
            }
            
            var i = 0;
            while(i < objects.size()) {
                var index = this.getIndex(objects.size());
                if(index != -1) {
                    nodes[index].insert(objects.remove(i));
                } else {
                    i++;
                }
            }
        }
    }
    
    this.retrieve = function(returnObjects, pRect) {
        var index = this.getIndex(pRect);
        if(index != -1 && nodes[0] != null) {
            nodes[index].retrieve(returnObjects, pRect);
        }
        
        returnObjects.addAll(objects);
        
        return returnObjects;
    }
}

function Rectangle(x, y, w, h) {
    var x = x;
    var y = y;
    var w = w;
    var h = h;
    
    this.getX = function() {
        return this.x;
    }
    
    this.getY = function() {
        return this.y;
    }
    
    this.getWidth = function() {
        return this.w;
    }
    
    this.getHeight = function() {
        return this.h;
    }
}