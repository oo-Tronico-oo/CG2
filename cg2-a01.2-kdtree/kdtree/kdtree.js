/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: kdtree
 *
 *
 */


/* requireJS module definition */
define(["kdutil", "vec2", "Scene", "KdNode", "BoundingBox"],
    (function(KdUtil, vec2, Scene, KdNode, BoundingBox) {

        "use strict";

        /**
         * Creates a kd-tree. The build function is directly called
         * on generation
         *
         * @param pointList
         * @constructor
         */
        var KdTree = function (pointList) {

            this.pointList = pointList;
            /**
             *
             * @param pointList - list of points
             * @param dim       - current axis
             * @param parent    - current parent (starts with root)
             * @param isLeft    - flag if node is left or right child of its parent
             * @returns returns root node after tree is build
             */
            this.build = function(pointList, dim, parent, isLeft) {
                
                // IMPLEMENT!
                // create new node
                var kdNode = new KdNode(dim);

                // find median position in pointList
                var indexArray = KdUtil.median(pointList, dim);
                
                // compute next axis
                var nextAxis = Math.abs(dim-1);
                
                // set point in node
                kdNode.point = pointList[indexArray];
                
                // compute bounding box for node
                // check if node is root (has no parent)
                // 
                // take a look in findNearestNeighbor why we  
                // need this bounding box!
                if( !parent ) {
                    // Note: hardcoded canvas size here
                    var boxHeight = $("#drawing_area").attr("height");
                    var boxWidth = $("#drawing_area").attr("width");
                    
                    kdNode.bbox = new BoundingBox(0, 0, boxWidth, boxHeight, kdNode.point, dim);
                } else {
                    // create bounding box and distinguish between axis and
                    // which side (left/right) the node is on
                    if(dim){
                        if(isLeft){
                            kdNode.bbox = new BoundingBox(parent.bbox.xmin, parent.bbox.ymin, parent.point.center[0], parent.bbox.ymax, kdNode.point, dim);
                        }else
                            kdNode.bbox = new BoundingBox(parent.point.center[0], parent.bbox.ymin, parent.bbox.xmax, parent.bbox.ymax, kdNode.point, dim);
                    } else {
                        if(isLeft){
                            kdNode.bbox = new BoundingBox(parent.bbox.xmin, parent.bbox.ymin, parent.bbox.xmax, parent.point.center[1], kdNode.point, dim);
                        }else
                            kdNode.bbox = new BoundingBox(parent.bbox.xmin, parent.point.center[1], parent.bbox.xmax, parent.bbox.ymax, kdNode.point, dim);
                    }
                    
                    
                };

                // create point list left/right and
                // call build for left/right arrays
                var pointListLeftSite = [];
                var pointListRightSite = [];
                
                for(var i = 0; i < pointList.length; i++){
                    if(!(pointList[i].center === kdNode.point.center) && pointList[i].center[dim] <= kdNode.point.center[dim]) pointListLeftSite.push(pointList[i]);
                    if(!(pointList[i].center === kdNode.point.center) && pointList[i].center[dim] > kdNode.point.center[dim]) pointListRightSite.push(pointList[i]);
                }
                
                if(pointListLeftSite.length > 0) kdNode.leftChild = this.build(pointListLeftSite, nextAxis, kdNode, true);
                if(pointListRightSite.length > 0)kdNode.rightChild = this.build(pointListRightSite, nextAxis, kdNode, false);
                
                // return root node
                return kdNode;
            };

            /**
             * Given a query point the function return its nearest neighbor by traversing
             * down the tree
             *
             * @param node - current tree node
             * @param query - query node
             * @param nearestDistance - current nearest distance to query node
             * @param currentBest - current best/nearest node to query node
             * @param dim - current axis (x or y)
             * @returns closest tree node to query node
             */
            this.findNearestNeighbor = function(node, query, nearestDistance, currentBest, dim) {

                if( !node ) {
                    return currentBest;
                }

                var closest = currentBest;
                var closestDistance = nearestDistance;

                var dist = KdUtil.distance(node.point.center, query.center);
                if( dist < nearestDistance ) {
                    closestDistance = dist;
                    closest = node;
                }

                var first, second;
                if (dim === 0) {
                    if ( query.center[0] < node.point.center[0]) {
                        first = node.leftChild;
                        second = node.rightChild;
                    } else {
                        first = node.rightChild;
                        second = node.leftChild;
                    }
                } else {
                    if (query.center[1] < node.point.center[1]) {
                        first = node.leftChild;
                        second = node.rightChild;
                    } else {
                        first = node.rightChild;
                        second = node.leftChild;
                    }
                }

                var nextDim = (dim === 0) ? 1 : 0;
                if( first && first.bbox.distanceTo(query.center) < closestDistance) {
                    closest = this.findNearestNeighbor(first, query, closestDistance, closest, nextDim);
                    closestDistance = KdUtil.distance(closest.point.center, query.center);
                }

                if( second && second.bbox.distanceTo(query.center) < closestDistance) {
                    closest = this.findNearestNeighbor(second, query, closestDistance, closest, nextDim);
                }

                return closest;
            };


            //
            this.root = this.build(pointList, 0);
            console.log(" this is the root: ", this.root);

        };

        return KdTree;


    })); // define


