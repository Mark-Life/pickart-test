import { relations } from "drizzle-orm/relations";
import { bankAccounts, artists, users, hosts, countries, properties, propertyTypes, propertyPhotos, spots, spotPhotos, artworks, artworkPhotos, artworkSpotAllocations, registrationApprovals, propertyAdmins } from "./schema";

export const artistsRelations = relations(artists, ({one, many}) => ({
	bankAccount: one(bankAccounts, {
		fields: [artists.bankAccountId],
		references: [bankAccounts.id]
	}),
	user: one(users, {
		fields: [artists.userId],
		references: [users.id]
	}),
	artworks: many(artworks),
}));

export const bankAccountsRelations = relations(bankAccounts, ({one, many}) => ({
	artists: many(artists),
	hosts: many(hosts),
	country: one(countries, {
		fields: [bankAccounts.countryCode],
		references: [countries.code]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	artists: many(artists),
	hosts: many(hosts),
	country: one(countries, {
		fields: [users.countryCode],
		references: [countries.code]
	}),
	artworkSpotAllocations: many(artworkSpotAllocations),
	registrationApprovals_approvedBy: many(registrationApprovals, {
		relationName: "registrationApprovals_approvedBy_users_id"
	}),
	registrationApprovals_userId: many(registrationApprovals, {
		relationName: "registrationApprovals_userId_users_id"
	}),
}));

export const hostsRelations = relations(hosts, ({one, many}) => ({
	bankAccount: one(bankAccounts, {
		fields: [hosts.bankAccountId],
		references: [bankAccounts.id]
	}),
	user: one(users, {
		fields: [hosts.userId],
		references: [users.id]
	}),
	properties: many(properties),
	propertyAdmins: many(propertyAdmins),
}));

export const countriesRelations = relations(countries, ({many}) => ({
	users: many(users),
	bankAccounts: many(bankAccounts),
	properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({one, many}) => ({
	country: one(countries, {
		fields: [properties.countryCode],
		references: [countries.code]
	}),
	host: one(hosts, {
		fields: [properties.ownerId],
		references: [hosts.id]
	}),
	propertyType: one(propertyTypes, {
		fields: [properties.propertyType],
		references: [propertyTypes.name]
	}),
	propertyPhotos: many(propertyPhotos),
	spots: many(spots),
	propertyAdmins: many(propertyAdmins),
}));

export const propertyTypesRelations = relations(propertyTypes, ({many}) => ({
	properties: many(properties),
}));

export const propertyPhotosRelations = relations(propertyPhotos, ({one}) => ({
	property: one(properties, {
		fields: [propertyPhotos.propertyId],
		references: [properties.id]
	}),
}));

export const spotsRelations = relations(spots, ({one, many}) => ({
	property: one(properties, {
		fields: [spots.propertyId],
		references: [properties.id]
	}),
	spotPhotos: many(spotPhotos),
	artworks: many(artworks),
	artworkSpotAllocations: many(artworkSpotAllocations),
}));

export const spotPhotosRelations = relations(spotPhotos, ({one}) => ({
	spot: one(spots, {
		fields: [spotPhotos.spotId],
		references: [spots.id]
	}),
}));

export const artworksRelations = relations(artworks, ({one, many}) => ({
	artist: one(artists, {
		fields: [artworks.artistId],
		references: [artists.id]
	}),
	spot: one(spots, {
		fields: [artworks.currentSpotId],
		references: [spots.id]
	}),
	artworkPhotos: many(artworkPhotos),
	artworkSpotAllocations: many(artworkSpotAllocations),
}));

export const artworkPhotosRelations = relations(artworkPhotos, ({one}) => ({
	artwork: one(artworks, {
		fields: [artworkPhotos.artworkId],
		references: [artworks.id]
	}),
}));

export const artworkSpotAllocationsRelations = relations(artworkSpotAllocations, ({one}) => ({
	user: one(users, {
		fields: [artworkSpotAllocations.allocatedBy],
		references: [users.id]
	}),
	artwork: one(artworks, {
		fields: [artworkSpotAllocations.artworkId],
		references: [artworks.id]
	}),
	spot: one(spots, {
		fields: [artworkSpotAllocations.spotId],
		references: [spots.id]
	}),
}));

export const registrationApprovalsRelations = relations(registrationApprovals, ({one}) => ({
	user_approvedBy: one(users, {
		fields: [registrationApprovals.approvedBy],
		references: [users.id],
		relationName: "registrationApprovals_approvedBy_users_id"
	}),
	user_userId: one(users, {
		fields: [registrationApprovals.userId],
		references: [users.id],
		relationName: "registrationApprovals_userId_users_id"
	}),
}));

export const propertyAdminsRelations = relations(propertyAdmins, ({one}) => ({
	property: one(properties, {
		fields: [propertyAdmins.propertyId],
		references: [properties.id]
	}),
	host: one(hosts, {
		fields: [propertyAdmins.userId],
		references: [hosts.id]
	}),
}));