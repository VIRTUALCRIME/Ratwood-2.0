// Add Kingsfield category tag for joinlate menu section
#define CTAG_KINGSFIELD "ctag_kingsfield"

/datum/job/roguetown/kingsfield_visitor
	title = "Kingsfield Visitor"
	faction = "Station"
	total_positions = 20
	spawn_positions = 20
	selection_color = "#8d8f78"
	allowed_races = RACES_ALL_KINDS
	allowed_sexes = list(MALE, FEMALE)
	tutorial = "You have left your old life and arrived in Kingsfield as a humble visitor."
	outfit = /datum/outfit/job/roguetown/kingsfield_visitor/basic
	display_order = JDO_PILGRIM
	show_in_credits = FALSE
	announce_latejoin = FALSE
	min_pq = 0
	max_pq = null
	can_random = FALSE
	bypass_jobban = TRUE
	bypass_lastclass = TRUE
	advclass_cat_rolls = list(CTAG_KINGSFIELD = 20)
	job_subclasses = list(
		/datum/advclass/kingsfield_visitor
	)

/datum/advclass/kingsfield_visitor
	name = "Kingsfield Visitor"
	tutorial = "You have left your old life and arrived in Kingsfield as a humble visitor."
	outfit = /datum/outfit/job/roguetown/kingsfield_visitor/basic
	category_tags = list(CTAG_KINGSFIELD)

/datum/outfit/job/roguetown/kingsfield_visitor/basic/pre_equip(mob/living/carbon/human/H)
	. = ..()
	if(should_wear_femme_clothes(H))
		shirt = /obj/item/clothing/suit/roguetown/shirt/dress/silkdress
		pants = /obj/item/clothing/under/roguetown/tights/black
	else
		shirt = /obj/item/clothing/suit/roguetown/shirt/undershirt/vagrant
		pants = /obj/item/clothing/under/roguetown/tights/vagrant
	shoes = /obj/item/clothing/shoes/roguetown/shortboots
	belt = /obj/item/storage/belt/rogue/leather/rope
	beltl = /obj/item/storage/belt/rogue/pouch/coins/poor
	backr = /obj/item/storage/backpack/rogue/satchel
	backpack_contents = list(
		/obj/item/flashlight/flare/torch = 1,
		/obj/item/reagent_containers/food/snacks/rogue/bread = 1,
	)
