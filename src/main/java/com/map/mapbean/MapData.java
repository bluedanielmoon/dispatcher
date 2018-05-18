package com.map.mapbean;

import org.springframework.stereotype.Component;

@Component
public class MapData {
	private Blocks blocks;
	private Lines lines;
	private Sites sites;

	public Blocks getBlocks() {
		return blocks;
	}
	public void setBlocks(Blocks blocks) {
		this.blocks = blocks;
	}
	public Lines getLines() {
		return lines;
	}
	public void setLines(Lines lines) {
		this.lines = lines;
	}
	public Sites getSites() {
		return sites;
	}
	public void setSites(Sites sites) {
		this.sites = sites;
	}
	
	
	
}
