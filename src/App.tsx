import { CssBaseline, Divider, IconButton, Menu, MenuItem, Slider } from '@material-ui/core';
import { FlowGallery, GridGallery, MasonryGallery, MasonryGalleryDirection } from 'lib';
import React, { ChangeEvent, FC, useCallback, useMemo, useRef, useState } from 'react';
import { TargetType, UnsplashCollectionSource, useUnsplashStatic } from 'stories/hooks';
import { ViewQuilt as ViewQuiltIcon, ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from '@material-ui/icons';

import ModuleStyles from './App.module.scss';

// const LAYOUT_ID = 'LayoutChooser';

const ZOOMSCALE_MIN = 0;
const ZOOMSCALE_MAX = 2;
const ZOOMSCALE_STEP = 0.25;

enum Layout {
  Flow = 'Flow',
  Grid = 'Grid',
  Masonry = 'Masonry'
}

const App: FC = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [menuElement, setMenuElement] = useState<null | HTMLElement>(null);

  const showLayoutMenu = Boolean(menuElement);

  const [layout, setLayout] = useState<Layout>(Layout.Flow);
  const [zoomScale, setZoomScale] = useState(1);

  const imageCount = 50;
  const targetSize = Math.floor(320 * zoomScale);
  const direction = MasonryGalleryDirection.Vertical;
  const collectionSource = UnsplashCollectionSource.Landscape;

  const collection = useUnsplashStatic({
    imageCount,
    targetSize,
    targetType: direction === MasonryGalleryDirection.Vertical ? TargetType.Width : TargetType.Height,
    collectionSource
  });
  const mediaItems = collection?.items ?? [];

  const zoomOutHandler = useCallback(() => {
    setZoomScale(Math.max(zoomScale - ZOOMSCALE_STEP, ZOOMSCALE_MIN));
  }, [zoomScale]);

  const zoomInHandler = useCallback(() => {
    setZoomScale(Math.min(zoomScale + ZOOMSCALE_STEP, ZOOMSCALE_MAX));
  }, [zoomScale]);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleZoomOnChange = useCallback((_: ChangeEvent<{}>, newValue: number | number[]) => {
    setZoomScale(Array.isArray(newValue) ? newValue[0] : newValue);
  }, []);

  const handleLayoutMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuElement(event.currentTarget);
  }, []);

  const handleLayoutMenuClose = useCallback(() => {
    setMenuElement(null);
  }, []);

  const menuItems = useMemo(() => {
    return Object.keys(Layout).map((key, index) => {
      return (
        <MenuItem
          key={index}
          selected={key === layout}
          onClick={(): void => {
            setLayout(key as Layout);
            handleLayoutMenuClose();
          }}>
          {key}
        </MenuItem>
      );
    });
  }, [handleLayoutMenuClose, layout]);

  return (
    <>
      <CssBaseline />
      <div className={ModuleStyles.root}>
        <div className={ModuleStyles.layoutModule}>
          <IconButton aria-controls="menu-layout" aria-haspopup="true" onClick={handleLayoutMenuOpen}>
            <ViewQuiltIcon />
          </IconButton>
          <Menu
            id="menu-layout"
            anchorEl={menuElement}
            open={showLayoutMenu}
            onClose={handleLayoutMenuClose}
            keepMounted>
            {menuItems}
          </Menu>
          <Divider orientation="vertical" flexItem />
          <IconButton onClick={zoomOutHandler}>
            <ZoomOutIcon />
          </IconButton>
          <Slider
            style={{ width: 120 }}
            min={ZOOMSCALE_MIN}
            max={ZOOMSCALE_MAX}
            step={ZOOMSCALE_STEP}
            value={zoomScale}
            onChange={handleZoomOnChange}
            marks
          />
          <IconButton onClick={zoomInHandler}>
            <ZoomInIcon />
          </IconButton>
        </div>
        <div className={ModuleStyles.container} ref={elementRef} role="presentation" tabIndex={-1}>
          {layout === Layout.Flow && <FlowGallery items={mediaItems} targetSize={targetSize} padding={20} margin={5} />}
          {layout === Layout.Grid && <GridGallery items={mediaItems} targetSize={targetSize} padding={20} margin={5} />}
          {layout === Layout.Masonry && (
            <MasonryGallery
              items={mediaItems}
              targetSize={targetSize}
              padding={20}
              margin={5}
              direction={MasonryGalleryDirection.Vertical}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
