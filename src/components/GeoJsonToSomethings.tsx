// @ts-ignore
import * as turf from "@turf/turf";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Layer, Marker, Source, useMap } from "react-map-gl/maplibre";

export const GeoJsonToSomethings: React.FC<{
  geojson?: FeatureCollection;
  emoji?: string;
  style?: {
    color?: string;
    fillColor?: string;
    emoji?: string;
  };
}> = ({ geojson, emoji, style }) => {
  // const { current: map } = useMap();

  // const [currentZoom, setCurrentZoom] = useState<number | undefined>(8);
  // const [opacity, setOpacity] = useState(0.8);
  // const [fontSize, setFontSize] = useState("1em");

  // useEffect(() => {
  //   if (!map) return;
  //   map.on("load", () => {
  //     setCurrentZoom(map.getZoom());
  //   });
  //   map.on("move", () => {
  //     setCurrentZoom(map.getZoom());
  //   });
  //   setCurrentZoom(map.getZoom());
  // }, [map]);

  // // determine style of markers
  // useEffect(() => {
  //   let newOpacity = 0.8;
  //   let newFontSize = "1em";
  //   if (currentZoom) {
  //     if (14 <= currentZoom) {
  //       newOpacity = 1;
  //       newFontSize = "1.4em";
  //     }
  //     if (currentZoom < 14) {
  //       newOpacity = 0.8;
  //       newFontSize = "1.4em";
  //     }
  //     if (currentZoom < 13) {
  //       newOpacity = 0.75;
  //       newFontSize = "1.3em";
  //     }
  //     if (currentZoom < 12) {
  //       newOpacity = 0.7;
  //       newFontSize = "1.1em";
  //     }
  //     if (currentZoom < 11) {
  //       newOpacity = 0.6;
  //       newFontSize = "1em";
  //     }
  //     if (currentZoom < 10) {
  //       newOpacity = 0.65;
  //       newFontSize = "1em";
  //     }
  //   }
  //   //console.info("zoom, size, opacity:", currentZoom, newFontSize, newOpacity);
  //   setOpacity(newOpacity);
  //   setFontSize(newFontSize);
  // }, [currentZoom]);

  // const onClickMarker = useCallback(
  //   (center: Feature<Point, GeoJsonProperties> | undefined) => {
  //     if (map === undefined || center === undefined) {
  //       return;
  //     }
  //     const zoomTo = map.getZoom() < 10 ? 10 : 14;
  //     map.flyTo({
  //       center: [
  //         center.geometry.coordinates[0],
  //         center.geometry.coordinates[1],
  //       ],
  //       zoom: zoomTo,
  //     });
  //   },
  //   [map]
  // );

  if (geojson === undefined || geojson.features === undefined) {
    return null;
  }

  return (
    <Source
      id="clusterSource"
      type="geojson"
      data={geojson}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={50}
    >
      <Layer
        {...{
          id: "clusters",
          type: "circle",
          source: "clusterSource",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        }}
      />

      <Layer
        {...{
          id: "cluster-count",
          type: "symbol",
          source: "clusterSource",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          },
        }}
      />

      <Layer
        {...{
          id: "unclustered-point",
          type: "circle",
          source: "clusterSource",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#11b4da",
            "circle-radius": 10,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        }}
      />
    </Source>
  );
};
