/**
 * Copyright 2010-2012 Ralph Schaer <ralphschaer@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package ch.ralscha.extdirectspring.demo.pivot;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import javax.annotation.PostConstruct;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import au.com.bytecode.opencsv.CSVReader;
import ch.ralscha.extdirectspring.annotation.ExtDirectMethod;
import ch.ralscha.extdirectspring.annotation.ExtDirectMethodType;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;

@Service
public class PivotService {

	@Autowired
	private Resource countries;

	private Map<String, String> countriesMap;

	@PostConstruct
	public void readData() throws IOException {
		ImmutableMap.Builder<String, String> builder = ImmutableMap.builder();

		try (InputStream is = countries.getInputStream();
				BufferedReader br = new BufferedReader(new InputStreamReader(is));
				CSVReader reader = new CSVReader(br, ';')) {
			String[] nextLine;
			while ((nextLine = reader.readNext()) != null) {
				if (nextLine.length == 2) {
					builder.put(nextLine[0].trim(), nextLine[1].trim());
				}
			}
		}

		countriesMap = builder.build();
	}

	@ExtDirectMethod(value = ExtDirectMethodType.STORE_READ, group = "pivot")
	public List<Economy> getEconomiesData() {
		int currentYear = DateTime.now().getYear();

		ImmutableList.Builder<Economy> builder = ImmutableList.builder();
		for (String economy : countriesMap.keySet()) {

			for (int i = 0; i < ThreadLocalRandom.current().nextInt(1, 3); i++) {
				for (int year = 2004; year <= currentYear; year++) {
					int procedure = ThreadLocalRandom.current().nextInt(21);
					int time = ThreadLocalRandom.current().nextInt(200);
					builder.add(new Economy(economy, countriesMap.get(economy), year, procedure, time));
				}
			}

		}
		return builder.build();
	}

}